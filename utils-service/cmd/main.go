package main

import (
	"log"

	"your-module/internal/handlers"
	"your-module/internal/kafka"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Инициализация Kafka
	kafkaClient, err := kafka.NewKafkaClient()
	if err != nil {
		log.Fatalf("Failed to initialize Kafka: %v", err)
	}
	defer kafkaClient.Close()

	// Создание Fiber приложения
	app := fiber.New(fiber.Config{
		// Добавьте необходимые настройки конфигурации
	})

	// Добавление middleware
	app.Use(logger.New())

	// Настройка маршрутов
	setupRoutes(app, kafkaClient)

	// Запуск сервера
	log.Fatal(app.Listen(":8080"))
}

func setupRoutes(app *fiber.App, kafkaClient *kafka.KafkaClient) {
	parserHandler := handlers.NewParserHandler(kafkaClient.Writer)
	app.Post("/parse", parserHandler.ParseHandler)
}
