package main

import (
	"os"

	"github.com/segmentio/kafka-go"
)

var writer *kafka.Writer

func kafkainit() (*kafka.Writer, error) {
	// Читаем адрес брокера Kafka из переменной окружения
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	if kafkaBroker == "" {
		kafkaBroker = "localhost:29092" // Адрес по умолчанию для Docker-сети
	}

	topic := os.Getenv("TOPIC")
	if topic == "" {
		topic = "parsing"
	}

	groupID := os.Getenv("GROUP_ID")
	if groupID == "" {
		groupID = "1"
	}
	// Настройка Kafka
	writer := kafka.NewWriter(kafka.WriterConfig{
		Brokers: []string{kafkaBroker},
		Topic:   topic,
	})

	return writer, nil

}
