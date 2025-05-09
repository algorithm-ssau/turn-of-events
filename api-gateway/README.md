# API Gateway для проекта "Оборот Событий"

API Gateway на основе Spring Cloud Gateway для проекта "Оборот Событий". Служит единой точкой входа для всех клиентских запросов к различным микросервисам.

## Функциональность

- Маршрутизация запросов к соответствующим микросервисам
- Логирование запросов и ответов
- Обработка CORS
- Централизованная обработка ошибок
- Мониторинг и метрики через Spring Actuator

## Маршруты

Gateway настроен на следующие маршруты:

- `/api/user/**` → Сервис пользователей (User Service)
- `/api/events/**` → Сервис событий (Event Service)
- `/**` → Фронтенд

## Требования

- Java 17
- Maven 3.8+

## Сборка и запуск

### Локальная разработка

```bash
mvn clean install
mvn spring-boot:run
```

### Docker

```bash
docker build -t api-gateway .
docker run -p 8080:8080 api-gateway
```

## Мониторинг

API Gateway предоставляет точки доступа для мониторинга через Spring Actuator:

- `/actuator/health` - проверка состояния сервиса
- `/actuator/info` - информация о приложении
- `/actuator/metrics` - метрики приложения

## Настройка

Основная конфигурация находится в файле `application.yml`. Для изменения маршрутов или добавления новых сервисов отредактируйте соответствующие разделы конфигурации. 