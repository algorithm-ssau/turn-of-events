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

## Запуск проекта
1. Установите MySQL и создайте базу данных `events_db`.
2. Склонируйте репозиторий и откройте проект в IntelliJ IDEA.
3. Убедитесь, что в `application.yml` указаны корректные настройки подключения к БД.
4. Запустите сервис командой:
   ```sh
   mvn spring-boot:run
   ```
5. API будет доступно по адресу `http://localhost:8080/events`.
6. Документация API: `http://localhost:8080/swagger-ui.html`.

## API
- `GET /events` — Получить список всех событий.
- `POST /events` — Создать новое событие.
- `GET /events/{id}` — Получить событие по ID.
- `PUT /events/{id}` — Обновить событие.
- `DELETE /events/{id}` — Удалить событие.
