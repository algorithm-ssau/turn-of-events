#include <iostream>
#include <sstream>
#include <csignal>
#include <cstdlib>
#include <librdkafka/rdkafkacpp.h>
#include <pqxx/pqxx>
#include <memory>

// Константы
namespace config {
    constexpr int KAFKA_TIMEOUT_MS = 1000;
    constexpr const char* DEFAULT_BROKERS = "localhost:9092";
    constexpr const char* DEFAULT_TOPIC = "product_rating_update";
    constexpr const char* DEFAULT_PG_CONN = "dbname=your_db user=your_user password=your_password host=your_host";
}

// Флаг для завершения
volatile bool run = true;

class MessageProcessor {
private:
    std::string pg_conn_str_;
    std::unique_ptr<pqxx::connection> conn_;

    void ensureConnection() {
        if (!conn_ || !conn_->is_open()) {
            conn_ = std::make_unique<pqxx::connection>(pg_conn_str_);
        }
    }

    void updateRating(int event_id, int rating) {
        ensureConnection();
        pqxx::work W(*conn_);

        // Используем prepared statements для оптимизации
        static const std::string insert_query = 
            "INSERT INTO ratings (event_id, rating) VALUES ($1, $2)";
        static const std::string update_query = 
            "WITH new_avg AS ("
            "  SELECT AVG(rating) AS avg_rating "
            "  FROM ratings "
            "  WHERE event_id = $1"
            ") "
            "UPDATE events "
            "SET average_rating = (SELECT avg_rating FROM new_avg) "
            "WHERE id = $1";

        W.exec_params(insert_query, event_id, rating);
        W.exec_params(update_query, event_id);
        W.commit();
    }

public:
    explicit MessageProcessor(const std::string& conn_str) 
        : pg_conn_str_(conn_str) {}

    void processMessage(const std::string& payload) {
        std::istringstream iss(payload);
        int event_id, rating;

        if (!(iss >> event_id >> rating)) {
            throw std::runtime_error("Неверный формат сообщения");
        }

        std::cout << "Обработка: event_id=" << event_id << ", rating=" << rating << std::endl;
        
        try {
            updateRating(event_id, rating);
            std::cout << "Рейтинг обновлен для мероприятия " << event_id << std::endl;
        } catch (const std::exception& e) {
            throw std::runtime_error(std::string("Ошибка БД: ") + e.what());
        }
    }
};

std::string getEnvVar(const std::string& key, const std::string& default_value) {
    const char* val = std::getenv(key.c_str());
    return val ? val : default_value;
}

static void sigterm(int) {
    run = false;
}

int main() {
    signal(SIGINT, sigterm);
    signal(SIGTERM, sigterm);

    try {
        // Конфигурация
        const std::string brokers = getEnvVar("KAFKA_BROKERS", config::DEFAULT_BROKERS);
        const std::string topic = getEnvVar("KAFKA_TOPIC", config::DEFAULT_TOPIC);
        const std::string pg_conn_str = getEnvVar("PG_CONN_STR", config::DEFAULT_PG_CONN);

        // Настройка Kafka
        std::string errstr;
        std::unique_ptr<RdKafka::Conf> conf(RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL));
        
        if (conf->set("bootstrap.servers", brokers, errstr) != RdKafka::Conf::CONF_OK ||
            conf->set("group.id", "rating_group", errstr) != RdKafka::Conf::CONF_OK) {
            throw std::runtime_error("Ошибка конфигурации Kafka: " + errstr);
        }

        // Создание consumer
        std::unique_ptr<RdKafka::KafkaConsumer> consumer(
            RdKafka::KafkaConsumer::create(conf.get(), errstr));
        if (!consumer) {
            throw std::runtime_error("Ошибка создания consumer: " + errstr);
        }

        // Подписка на топик
        std::vector<std::string> topics = { topic };
        RdKafka::ErrorCode err = consumer->subscribe(topics);
        if (err != RdKafka::ERR_NO_ERROR) {
            throw std::runtime_error("Ошибка подписки: " + std::string(RdKafka::err2str(err)));
        }

        MessageProcessor processor(pg_conn_str);
        std::cout << "Начало обработки сообщений..." << std::endl;

        // Основной цикл обработки
        while (run) {
            std::unique_ptr<RdKafka::Message> msg(
                consumer->consume(config::KAFKA_TIMEOUT_MS));

            switch (msg->err()) {
                case RdKafka::ERR_NO_ERROR: {
                    std::string payload(static_cast<const char*>(msg->payload()), msg->len());
                    try {
                        processor.processMessage(payload);
                    } catch (const std::exception& e) {
                        std::cerr << e.what() << std::endl;
                    }
                    break;
                }
                case RdKafka::ERR__TIMED_OUT:
                    break;
                default:
                    std::cerr << "Ошибка Kafka: " << msg->errstr() << std::endl;
                    break;
            }
        }

        consumer->close();
        RdKafka::wait_destroyed(5000);
        
    } catch (const std::exception& e) {
        std::cerr << "Критическая ошибка: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
