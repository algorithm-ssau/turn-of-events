package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getOperaEvents() ([]Event, error) {
	url := "https://opera-samara.ru/afisha/"
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("ошибка при запросе: %v", err)
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("ошибка: статус код %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("ошибка при чтении HTML: %v", err)
	}

	var events []Event

	doc.Find("li.item").Each(func(i int, s *goquery.Selection) {
		date := strings.TrimSpace(s.Find(".dateBox .date").Text())
		time := strings.TrimSpace(s.Find(".dateBox .time").Text())
		title := strings.TrimSpace(s.Find(".name").Text())
		genre := strings.TrimSpace(s.Find(".inf.genre").Text())
		duration := strings.TrimSpace(s.Find(".lenght").Text())
		ImageUrl, _ := s.Find("no_print").Attr("src")
		link, _ := s.Find("a").Attr("href")

		// Отладочный вывод
		fmt.Printf("Найдено: %s, %s, %s, %s, %s, %s, %s\n", date, time, title, genre, duration, ImageUrl, link)

		if title != "" && date != "" {
			events = append(events, Event{
				Date:  date,
				Title: title,
				Time:  time,
				Price: "", // На сайте нет информации о цене
				Place: "Самарский театр оперы и балета",
			})
		}
	})

	defer resp.Body.Close()

	if len(events) == 0 {
		fmt.Println("❌ Парсер не нашел ни одного события! Проверьте селекторы.")
	}

	return events, nil
}

func saveEventsToDB(collection *mongo.Collection, events []Event) {
	for _, event := range events {
		filter := bson.M{"title": event.Title, "date": event.Date, "place": event.Place}
		update := bson.M{"$setOnInsert": event}
		opts := options.Update().SetUpsert(true)

		result, err := collection.UpdateOne(context.Background(), filter, update, opts)
		if err != nil {
			log.Printf("Ошибка записи в MongoDB: %v\n", err)
		} else {
			if result.UpsertedCount > 0 {
				fmt.Printf("Новое событие сохранено: %s\n", event.Title)
			} else {
				fmt.Printf("Событие уже существует: %s\n", event.Title)
			}
		}
	}
}
