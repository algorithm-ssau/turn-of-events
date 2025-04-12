[![Dependabot Updates](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/dependabot/dependabot-updates/badge.svg?branch=master)](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/dependabot/dependabot-updates)
[![Build and Push Docker Images to Personal ghcr.io](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/build-push.yml/badge.svg?branch=master)](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/build-push.yml)
[![Deploy to Kubernetes](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/algorithm-ssau/turn-of-events/actions/workflows/deploy.yml)
# Оборот Событий

**Оборот Событий** – это веб-сервис афиши городских мероприятий, построенный на основе микросервисной архитектуры. Проект предназначен для удобного поиска, размещения и управления городскими событиями, объединяя как пользователей, так и организаторов мероприятий.

## Содержание

- [Описание проекта](#описание-проекта)
- [Ключевые возможности](#ключевые-возможности)
- [Архитектура](#архитектура)
- [Технологический стек](#технологический-стек)
- [Установка и запуск](#установка-и-запуск)
- [Вклад в проект](#вклад-в-проект)

## Описание проекта

**Оборот Событий** – это динамичная платформа, позволяющая:
- Просматривать афишу актуальных мероприятий в городе.
- Фильтровать события по дате, категории, локации и другим параметрам.
- Регистрироваться и авторизовываться через email.
- Управлять избранными событиями и получать уведомления о новинках.
- Организаторам предоставляется возможность создавать, редактировать и управлять своими мероприятиями, а также анализировать статистику.

## Ключевые возможности

- **Афиша мероприятий:** Удобный интерфейс для поиска и просмотра предстоящих событий.
- **Регистрация и авторизация:** Поддержка различных методов входа, включая соцсети.
- **Личный кабинет:** Управление избранным, история просмотров и настройки уведомлений.
- **Управление событиями:** Интерфейс для организаторов с возможностью загрузки промо-материалов.
- **Отзывы и рейтинги:** Возможность оставлять комментарии и оценивать мероприятия.
- **Интеграция с картами:** Отображение местоположения событий с помощью популярных картографических сервисов.
- **Уведомления:** Push, email и SMS-уведомления о новых событиях и изменениях.

## Архитектура

Проект реализован на основе микросервисной архитектуры, что обеспечивает гибкость и масштабируемость. Основные компоненты:

- **API Gateway:** Единая точка входа для всех клиентских запросов. Обеспечивает маршрутизацию, аутентификацию, агрегацию ответов и поддержку WebSocket.
- **User Service:** Управление пользователями – регистрация, авторизация и профили.
- **Event Service:** CRUD-операции и управление данными о мероприятиях.
- **Organizer Service:** Интерфейс для организаторов мероприятий, включая аналитику и статистику.
- **Search Service:** Быстрый и точный поиск событий (с использованием Elasticsearch).
- **Notification Service:** Отправка уведомлений (push, email, SMS) пользователям.
- **Review/Feedback Service:** Управление отзывами и комментариями.
- **Media Service:** Обработка и хранение мультимедийных файлов (изображения, видео).
- **Analytics Service:** Сбор и анализ статистических данных о работе сервиса.

<picture>
 <img alt="APPLICATION ARCHITECTURE" src="https://github.com/algorithm-ssau/turn-of-events/blob/master/APP.jpg">
</picture>


Также используются вспомогательные компоненты:
- **Service Discovery & Registry:** Автоматическое обнаружение микросервисов.
- **Centralized Configuration Service:** Централизованное управление конфигурацией.
- **Centralized Logging & Monitoring:** Агрегация логов и мониторинг состояния системы.
- **Message Broker:** Асинхронное взаимодействие между сервисами (Kafka).

## Технологический стек

- **Фронтенд:** React
- **Бэкенд:** Различные языки для различных микросервисов
- **База данных:** PostgreSQL, MongoDB
- **API:** RESTful API и/или GraphQL
- **Поиск:** Elasticsearch
- **Контейнеризация:** Docker (с использованием Docker Compose)
- **API Gateway:** Nginx (конфигурация с поддержкой WebSocket и проксированием)

## Установка и запуск

### Требования

- [Docker](https://www.docker.com/) и [Docker Compose](https://docs.docker.com/compose/)

### Локальная разработка

1. **Клонирование репозитория:**
   ```bash
   git clone https://github.com/algorithm-ssau/turn-of-events
   cd turn-of-events

### Доступ
Сайт доступен по адресу [http://194.87.208.217/](http://109.73.193.237/)

# Вклад в проект
* Лысов Илья [SecurityTrip](https://github.com/SecurityTrip) - Team Lead, Backend 
* Лебедев Евгений [F4NTOM41K](https://github.com/F4NTOM41K) - Frontend
* Михальчук Данила [ded-mikhalych](https://github.com/ded-mikhalych) - Backend
* Паршин Никита [Withotic](https://github.com/Withotic) - Frontend
* Дагаев Данила [Repkol](https://github.com/Repkol) - Frontend
