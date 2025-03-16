# Stage 1. Сборка приложения
FROM golang:1.24.1 AS builder

WORKDIR /app

# Копируем файлы модулей и загружаем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем бинарник с отключённым CGO для статической сборки
RUN CGO_ENABLED=0 GOOS=linux go build -o parser .

# Stage 2. Формирование финального образа
FROM alpine:latest

# Добавляем корневые сертификаты
RUN apk --no-cache add ca-certificates

# Копируем бинарный файл из стадии сборки
COPY --from=builder /app/parser /usr/local/bin/parser

# Запускаем приложение
CMD ["parser"]
