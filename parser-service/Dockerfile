# Билд-этап (сборка бинарника)
FROM golang:1.24.1 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Сборка статически связанного бинарника
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o parser

# Финальный образ
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/parser .

CMD ["./parser"]
