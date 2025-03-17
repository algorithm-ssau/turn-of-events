package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Подключение к MongoDB
	clientOptions := options.Client().ApplyURI("mongodb://admin:admin123@mongodb:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	collection := client.Database("afisha").Collection("events")

	// Парсим события
	events, err := getEvents()
	if err != nil {
		log.Fatal("Ошибка парсинга событий:", err)
	}

	fmt.Println("Найденные события:")
	for _, event := range events {
		fmt.Printf("%+v\n", event)
	}

	saveEventsToDB(collection, events)

}
