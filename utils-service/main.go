package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware добавляет необходимые CORS-заголовки
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	var err error
	writer, err = kafkainit()

	if err != nil {
		log.Fatalf("Error Kafka initialization: %v", err)
	}

	router := gin.Default()
	router.Use(CORSMiddleware()) // Подключаем CORS middleware

	router.POST("/parce", parceHandler)
	router.Run("0.0.0.0:8080")
}
