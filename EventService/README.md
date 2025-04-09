# Event Service

## Описание
Event Service — это микросервис, который управляет событиями для веб-сервиса афиши городских мероприятий. Он реализует CRUD-операции и предоставляет API для взаимодействия с другими сервисами.

## Технологии
- Java 17
- Spring Boot 3.1
- Spring Data JPA
- MySQL
- OpenAPI (Swagger)

## Структура проекта
```
event-service/
├── src/main/java/com/turnofevents/com/
│   ├── controller/       # Контроллеры API
│   ├── service/          # Бизнес-логика
│   ├── repository/       # Доступ к БД
│   ├── model/            # Модели данных
│   ├── dto/              # Data Transfer Objects (DTO)
│   ├── config/           # Конфигурации (Swagger)
│   ├── EventServiceApplication.java  # Точка входа
├── src/main/resources/
│   ├── application.yml   # Конфигурации Spring Boot
├── pom.xml               # Зависимости Maven
├── .gitignore            # Исключение ненужных файлов из Git
├── README.md             # Описание проекта
```

## API
- `GET /events` — Получить список всех событий.
- `POST /events` — Создать новое событие.
- `GET /events/{id}` — Получить событие по ID.
- `PUT /events/{id}` — Обновить событие.
- `DELETE /events/{id}` — Удалить событие.
