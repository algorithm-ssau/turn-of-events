FROM golang:1.24.1-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o parser

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/parser .

EXPOSE 8080

CMD ["./parser"]
