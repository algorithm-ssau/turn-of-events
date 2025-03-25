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
    }else{
        std::cout << "Подписка на топик " << topic << " выполнена" << std::endl;
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
                // Message type: key: <any> value: <event_id> <rating>
                int event_id;
                int rating;
                if (iss >> event_id >> rating) {
                    std::cout << "event_id:  " << event_id << std::endl;
                    std::cout << "rating: " << rating <<  std::endl;
                    try {
                        // Устанавливаем соединение с PostgreSQL
                        pqxx::connection C(pg_conn_str);
                        pqxx::work W(C);

                        // 1. Вставляем новую оценку в таблицу оценок
                        std::string sqlInsert = "INSERT INTO ratings (event_id, rating) VALUES (" 
                                                + W.quote(event_id) + ", " + W.quote(rating) + ");";
                        W.exec(sqlInsert);

                        // 2. Получаем среднюю оценку для данного мероприятия
                        pqxx::result R = W.exec("SELECT AVG(rating) AS avg_rating FROM ratings WHERE event_id = " 
                                                + W.quote(event_id) + ";");
                        double avgRating = 0.0;
                        if (!R.empty() && !R[0]["avg_rating"].is_null()) {
                            avgRating = R[0]["avg_rating"].as<double>();
                        }

                        // 3. Обновляем в таблице мероприятий средний рейтинг данного мероприятия
                        std::string sqlUpdate = "UPDATE events SET average_rating = " + W.quote(avgRating) +
                                                " WHERE id = " + W.quote(event_id) + ";";
                        W.exec(sqlUpdate);

                        W.commit();
                        std::cout << "Для мероприятия " << event_id << " добавлена оценка " << rating 
                                << ", средний рейтинг обновлен до " << avgRating << std::endl;
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
