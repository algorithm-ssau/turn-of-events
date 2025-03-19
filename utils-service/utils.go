package main

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/segmentio/kafka-go"
)

func parceHandler(c *gin.Context) {
	// Получаем тело запроса
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(400, gin.H{"error": "Ошибка при чтении тела запроса: " + err.Error()})
		return
	}

	// Структура для парсинга JSON
	type RequestData struct {
		Key   string `json:"Key"`
		Value string `json:"Value"`
	}

	// Декодируем JSON
	var requestData RequestData
	if err := json.Unmarshal(body, &requestData); err != nil {
		c.JSON(400, gin.H{"error": "Ошибка парсинга JSON: " + err.Error()})
		return
	}

	// Проверяем, что Key и Value не пустые
	if requestData.Key == "" || requestData.Value == "" {
		c.JSON(400, gin.H{"error": "Поля 'Key' и 'Value' обязательны"})
		return
	}

	// Отправляем сообщение в Kafka
	err = writer.WriteMessages(c, kafka.Message{
		Key:   []byte(requestData.Key),
		Value: []byte(requestData.Value),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Ошибка при отправке в Kafka: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}
