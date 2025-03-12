# Этап сборки
FROM golang:1.24.1-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o media-service .

# Финальный образ
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/media-service .
EXPOSE 8088
CMD ["./media-service"]
