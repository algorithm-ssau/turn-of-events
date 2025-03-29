# Этап сборки
FROM golang:1.21-alpine AS builder

# Устанавливаем переменные окружения для статической сборки
ENV CGO_ENABLED=0
ENV GOOS=linux

WORKDIR /app

# Копируем файлы зависимостей и загружаем их
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем бинарник
RUN go build -o utils-service ./cmd/main.go

# Финальный этап
FROM alpine:latest

# Устанавливаем CA сертификаты и часовой пояс
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Копируем бинарник из этапа сборки
COPY --from=builder /app/utils-service .

# Открываем порт, который слушает приложение (обновлен согласно конфигурации Fiber)
EXPOSE 8080

# Задаем переменные окружения по умолчанию
ENV KAFKA_BROKER=kafka:9092
ENV TOPIC=parsing

# Запускаем приложение
CMD ["./utils-service"]