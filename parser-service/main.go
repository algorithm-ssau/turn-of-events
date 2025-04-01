package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Инициализация Fiber
	app := fiber.New(fiber.Config{
		AppName: "Parser Service",
	})

	// Middlewares
	app.Use(cors.New())
	app.Use(logger.New())

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

	// Kafka setup
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	if kafkaBroker == "" {
		kafkaBroker = "localhost:29092"
	}

	topic := os.Getenv("TOPIC")
	if topic == "" {
		topic = "parsing"
	}

	groupID := os.Getenv("GROUP_ID")
	if groupID == "" {
		groupID = "1"
	}

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   topic,
		GroupID: groupID,
	})
	defer reader.Close()

	// Routes
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"time":   time.Now(),
		})
	})

	app.Post("/parse", func(c *fiber.Ctx) error {
		events, err := getOperaEvents()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		saveEventsToDB(collection, events)
		return c.JSON(fiber.Map{
			"message": "Парсинг завершен успешно",
			"count":   len(events),
		})
	})

	// Kafka consumer
	go func() {
		for {
			msg, err := reader.ReadMessage(context.Background())
			if err != nil {
				log.Printf("Ошибка чтения из Kafka: %v\n", err)
				continue
			}

			log.Printf("Получено сообщение: %s\n", string(msg.Value))

			if string(msg.Value) == "startOpera" {
				events, err := getOperaEvents()
				if err != nil {
					log.Printf("Ошибка парсинга: %v\n", err)
					continue
				}

				saveEventsToDB(collection, events)
				log.Println("Парсинг завершён, данные сохранены в БД.")
			}
		}
	}()

	// Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		log.Println("Gracefully shutting down...")
		_ = app.Shutdown()
	}()

	// Start server
	log.Fatal(app.Listen(":8080"))
}
