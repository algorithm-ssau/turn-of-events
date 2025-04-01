package kafka

import (
	"os"

	"github.com/segmentio/kafka-go"
)

type KafkaClient struct {
	Writer *kafka.Writer
}

func NewKafkaClient() (*KafkaClient, error) {
	// Читаем адрес брокера Kafka из переменной окружения
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	if kafkaBroker == "" {
		kafkaBroker = "localhost:29092" // Адрес по умолчанию для Docker-сети
	}

	topic := os.Getenv("TOPIC")
	if topic == "" {
		topic = "parsing"
	}

	// Настройка Kafka writer
	writer := kafka.NewWriter(kafka.WriterConfig{
		Brokers: []string{kafkaBroker},
		Topic:   topic,
	})

	return &KafkaClient{
		Writer: writer,
	}, nil
}

// Close закрывает соединение с Kafka
func (k *KafkaClient) Close() error {
	return k.Writer.Close()
}
