package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/kafka-go"
)

type ParserHandler struct {
	kafkaWriter *kafka.Writer
}

func NewParserHandler(writer *kafka.Writer) *ParserHandler {
	return &ParserHandler{
		kafkaWriter: writer,
	}
}

type RequestData struct {
	Key   string `json:"Key"`
	Value string `json:"Value"`
}

func (h *ParserHandler) ParseHandler(c *fiber.Ctx) error {
	// Структура для парсинга JSON
	var requestData RequestData

	// Декодируем JSON
	if err := c.BodyParser(&requestData); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Ошибка парсинга JSON: " + err.Error(),
		})
	}

	// Проверяем, что Key и Value не пустые
	if requestData.Key == "" || requestData.Value == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Поля 'Key' и 'Value' обязательны",
		})
	}

	// Отправляем сообщение в Kafka
	err := h.kafkaWriter.WriteMessages(c.Context(), kafka.Message{
		Key:   []byte(requestData.Key),
		Value: []byte(requestData.Value),
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Ошибка при отправке в Kafka: " + err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{"status": "ok"})
}
