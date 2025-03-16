package main

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Event представляет структуру события
type Event struct {
	Title string    `bson:"title"`
	Date  time.Time `bson:"date"`
	Place string    `bson:"place"`
	Price string    `bson:"price"`
}

// parseRussianDate парсит дату в формате "17 апреля, 19:00"
func parseRussianDate(dateStr string) (time.Time, error) {
	parts := strings.Split(dateStr, ",")
	if len(parts) < 1 {
		return time.Time{}, fmt.Errorf("неверный формат даты")
	}
	dayMonth := strings.TrimSpace(parts[0])
	timePart := "00:00"
	if len(parts) > 1 {
		timePart = strings.TrimSpace(parts[1])
	}
	dm := strings.Split(dayMonth, " ")
	if len(dm) < 2 {
		return time.Time{}, fmt.Errorf("неверный формат дня и месяца")
	}
	day := dm[0]
	month := dm[1]

	months := map[string]string{
		"января": "January", "февраля": "February", "марта": "March",
		"апреля": "April", "мая": "May", "июня": "June",
		"июля": "July", "августа": "August", "сентября": "September",
		"октября": "October", "ноября": "November", "декабря": "December",
	}

	engMonth, ok := months[month]
	if !ok {
		return time.Time{}, fmt.Errorf("неизвестный месяц: %s", month)
	}

	year := time.Now().Year()
	fullDateStr := fmt.Sprintf("%s %s %d %s", day, engMonth, year, timePart)
	return time.Parse("2 January 2006 15:04", fullDateStr)
}

// getEvents использует Chromedp для загрузки и парсинга всех событий
func getEvents() ([]Event, error) {
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	var titleNodes, dateNodes, placeNodes, priceNodes []*cdp.Node

	// Открываем страницу и ждем полной загрузки
	err := chromedp.Run(ctx,
		chromedp.Navigate("https://afisha.yandex.ru/samara"),
		chromedp.Sleep(5*time.Second),
		// Прокручиваем страницу вниз несколько раз
		chromedp.ActionFunc(func(ctx context.Context) error {
			for i := 0; i < 3; i++ {
				if err := chromedp.Evaluate(`window.scrollTo(0, document.body.scrollHeight)`, nil).Do(ctx); err != nil {
					return err
				}
				time.Sleep(2 * time.Second) // Даем странице время для подгрузки
			}
			return nil
		}),
		chromedp.Sleep(5*time.Second),
		// Получаем узлы всех заголовков, дат, мест и цен
		chromedp.Nodes(`h2[data-test-id="eventCard.eventInfoTitle"]`, &titleNodes),
		chromedp.Nodes(`ul[data-test-id="eventCard.eventInfoDetails"] li:first-child`, &dateNodes),
		chromedp.Nodes(`ul[data-test-id="eventCard.eventInfoDetails"] li:nth-child(2) a`, &placeNodes),
		chromedp.Nodes(`[data-test-id="event-card-price"]`, &priceNodes),
	)

	if err != nil {
		return nil, err
	}

	titles := extractText(titleNodes)
	dates := extractText(dateNodes)
	places := extractText(placeNodes)
	prices := extractText(priceNodes)

	if len(titles) == 0 {
		return nil, fmt.Errorf("не удалось получить данные. Проверьте селекторы или убедитесь, что сайт доступен")
	}

	var events []Event
	for i := range titles {
		eventDate, err := parseRussianDate(dates[i])
		if err != nil {
			continue
		}
		if eventDate.Before(time.Now()) || eventDate.After(time.Now().AddDate(0, 0, 30)) {
			continue
		}

		event := Event{
			Title: titles[i],
			Date:  eventDate,
			Place: places[i],
			Price: prices[i],
		}
		events = append(events, event)
	}

	return events, nil
}

// extractText извлекает текст из узлов HTML
func extractText(nodes []*cdp.Node) []string {
	var results []string
	for _, node := range nodes {
		if node.NodeType == cdp.NodeTypeText {
			results = append(results, strings.TrimSpace(node.NodeValue))
		}
	}
	return results
}

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

	for _, event := range events {
		// Фильтр для upsert
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
