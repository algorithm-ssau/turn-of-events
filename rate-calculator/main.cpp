#include <iostream>
#include <sstream>
#include <csignal>
#include <cstdlib>
#include <librdkafka/rdkafkacpp.h>
#include <pqxx/pqxx>

// Флаг для корректного завершения приложения
volatile bool run = true;
static void sigterm (int sig) {
    run = false;
}

// Функция для получения переменной окружения с проверкой
std::string getEnvVar(const std::string &key, const std::string &default_value = "") {
    const char* val = std::getenv(key.c_str());
    return val == nullptr ? default_value : std::string(val);
}

int main() {
    // Обработка сигналов завершения
    signal(SIGINT, sigterm);
    signal(SIGTERM, sigterm);

    // Получение параметров подключения из переменных окружения
    std::string brokers = getEnvVar("KAFKA_BROKERS", "localhost:9092");
    std::string topic = getEnvVar("KAFKA_TOPIC", "product_rating_update");
    std::string pg_conn_str = getEnvVar("PG_CONN_STR", "dbname=your_db user=your_user password=your_password host=your_host");

    std::string errstr;
    
    // Создаем конфигурацию Kafka
    RdKafka::Conf *conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    if (conf->set("bootstrap.servers", brokers, errstr) != RdKafka::Conf::CONF_OK) {
        std::cerr << "Ошибка установки bootstrap.servers: " << errstr << std::endl;
        return 1;
    }
    if (conf->set("group.id", "rating_group", errstr) != RdKafka::Conf::CONF_OK) {
        std::cerr << "Ошибка установки group.id: " << errstr << std::endl;
        return 1;
    }
    
    // Создаем консьюмер
    RdKafka::KafkaConsumer *consumer = RdKafka::KafkaConsumer::create(conf, errstr);
    delete conf;
    if (!consumer) {
        std::cerr << "Не удалось создать consumer: " << errstr << std::endl;
        return 1;
    }
    
    // Подписываемся на топик
    std::vector<std::string> topics = { topic };
    RdKafka::ErrorCode err = consumer->subscribe(topics);
    if (err != RdKafka::ERR_NO_ERROR) {
        std::cerr << "Ошибка подписки: " << RdKafka::err2str(err) << std::endl;
        return 1;
    }
    
    while (run) {
        // Получаем сообщение из Kafka с таймаутом 1000 мс
        RdKafka::Message *msg = consumer->consume(1000);
        switch (msg->err()) {
            case RdKafka::ERR_NO_ERROR: {
                // Сообщение получено, обрабатываем его
                std::string payload(static_cast<const char*>(msg->payload()), msg->len());
                std::cout << "Получено сообщение: " << payload << std::endl;
                
                // Пример: сообщение содержит id товара и новый рейтинг, разделенные пробелом
                std::istringstream iss(payload);
                int product_id;
                double new_rating;
                if (iss >> product_id >> new_rating) {
                    try {
                        // Устанавливаем соединение с PostgreSQL
                        pqxx::connection C(pg_conn_str);
                        pqxx::work W(C);
                        // Формируем SQL-запрос для обновления рейтинга товара
                        std::string sql = "UPDATE products SET rating = " + W.quote(new_rating) +
                                          " WHERE id = " + W.quote(product_id) + ";";
                        W.exec(sql);
                        W.commit();
                        std::cout << "Обновлен товар " << product_id << " с новым рейтингом " << new_rating << std::endl;
                    } catch (const std::exception &e) {
                        std::cerr << "Ошибка работы с БД: " << e.what() << std::endl;
                    }
                } else {
                    std::cerr << "Ошибка парсинга данных из сообщения" << std::endl;
                }
                break;
            }
            case RdKafka::ERR__TIMED_OUT:
                // Таймаут ожидания сообщения – продолжаем цикл
                break;
            default:
                std::cerr << "Ошибка потребления: " << msg->errstr() << std::endl;
                break;
        }
        delete msg;
    }
    
    // Закрываем консьюмер
    consumer->close();
    delete consumer;
    RdKafka::wait_destroyed(5000);
    return 0;
}
