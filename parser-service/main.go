package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Читаем адрес брокера Kafka из переменной окружения
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	if kafkaBroker == "" {
		kafkaBroker = "localhost:29092" // Адрес по умолчанию для Docker-сети
	}

	// Подключение к MongoDB
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://admin:admin123@localhost:27017"
	}
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	collection := client.Database("afisha").Collection("events")

	// Настройка Kafka
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   "parser-topic",
		GroupID: "parser-group",
	})
	defer reader.Close()

	fmt.Println("Ожидание сообщений из Kafka...")

	// Канал для graceful shutdown
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		for {
			msg, err := reader.ReadMessage(context.Background())
			if err != nil {
				log.Printf("Ошибка чтения из Kafka: %v\n", err)
				continue
			}

			log.Printf("Получено сообщение: %s\n", string(msg.Value))

			// Запуск парсинга по запросу
			if string(msg.Value) == "start" {
				events, err := getEvents()
				if err != nil {
					log.Printf("Ошибка парсинга: %v\n", err)
					continue
				}

				saveEventsToDB(collection, events)
				log.Println("Парсинг завершён, данные сохранены в БД.")
			}
		}
	}()

	<-signalChan
	fmt.Println("Выход по сигналу завершения")
}
