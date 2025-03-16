package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gocolly/colly"
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
// и добавляет текущий год.
func parseRussianDate(dateStr string) (time.Time, error) {
	// Пример входной строки: "17 апреля, 19:00"
	parts := strings.Split(dateStr, ",")
	if len(parts) < 1 {
		return time.Time{}, errors.New("неверный формат даты")
	}
	dayMonth := strings.TrimSpace(parts[0]) // "17 апреля"
	timePart := "00:00"
	if len(parts) > 1 {
		timePart = strings.TrimSpace(parts[1])
	}
	dm := strings.Split(dayMonth, " ")
	if len(dm) < 2 {
		return time.Time{}, errors.New("неверный формат дня и месяца")
	}
	day := dm[0]
	monthRussian := dm[1]
	months := map[string]string{
		"января":   "January",
		"февраля":  "February",
		"марта":    "March",
		"апреля":   "April",
		"мая":      "May",
		"июня":     "June",
		"июля":     "July",
		"августа":  "August",
		"сентября": "September",
		"октября":  "October",
		"ноября":   "November",
		"декабря":  "December",
	}
	month, ok := months[monthRussian]
	if !ok {
		return time.Time{}, fmt.Errorf("неизвестный месяц: %s", monthRussian)
	}
	year := time.Now().Year()
	fullDateStr := fmt.Sprintf("%s %s %d %s", day, month, year, timePart)
	return time.Parse("2 January 2006 15:04", fullDateStr)
}

func main() {
	// Подключение к MongoDB с учётными данными и использованием имени сервиса из docker-compose ("mongodb")
	clientOptions := options.Client().ApplyURI("mongodb://admin:admin123@mongodb:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err = client.Disconnect(context.Background()); err != nil {
			log.Fatal(err)
		}
	}()
	collection := client.Database("afisha").Collection("events")

	// Создаем нового сборщика Colly
	c := colly.NewCollector(
		colly.AllowedDomains("afisha.yandex.ru"),
	)

	// Обработка карточки события
	c.OnHTML(`[data-test-id="eventCard.root"]`, func(e *colly.HTMLElement) {
		// Извлекаем заголовок
		title := e.ChildText(`h2[data-test-id="eventCard.eventInfoTitle"]`)
		if title == "" {
			log.Println("Заголовок не найден, пропускаем карточку")
			return
		}

		// Извлекаем строку с датой и временем
		dateStr := e.ChildText(`ul[data-test-id="eventCard.eventInfoDetails"] li:first-child`)
		eventDate, err := parseRussianDate(dateStr)
		if err != nil {
			log.Printf("Ошибка парсинга даты '%s': %v\n", dateStr, err)
			return
		}

		// Фильтрация: выбираем события, которые проходят в ближайшие 30 дней
		now := time.Now()
		if eventDate.Before(now) || eventDate.After(now.AddDate(0, 0, 30)) {
			return
		}

		// Извлекаем место проведения
		place := e.ChildText(`ul[data-test-id="eventCard.eventInfoDetails"] li:nth-child(2) a`)
		// Извлекаем цену
		price := e.ChildText(`[data-test-id="event-card-price"]`)

		event := Event{
			Title: title,
			Date:  eventDate,
			Place: place,
			Price: price,
		}

		// Записываем событие в MongoDB
		_, err = collection.InsertOne(context.Background(), event)
		if err != nil {
			log.Printf("Ошибка записи в MongoDB: %v\n", err)
		} else {
			fmt.Printf("Событие сохранено: %s\n", title)
		}
	})

	// Обработка пагинации (если требуется)
	c.OnHTML(".pagination-next", func(e *colly.HTMLElement) {
		nextPage := e.Request.AbsoluteURL(e.Attr("href"))
		fmt.Println("Переход на следующую страницу:", nextPage)
		e.Request.Visit(nextPage)
	})

	// Начинаем парсинг с главной страницы событий для Самары
	err = c.Visit("https://afisha.yandex.ru/samara")
	if err != nil {
		log.Fatal(err)
	}

	c.Wait()
}
