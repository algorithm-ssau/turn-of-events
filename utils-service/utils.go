package main

import (
	"github.com/gin-gonic/gin"
	"github.com/segmentio/kafka-go"
)

func parceHandler(c *gin.Context) {
	// Получаем тело запроса
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Отправляем тело запроса в Kafka
	err = writer.WriteMessages(c, kafka.Message{Value: body})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}
