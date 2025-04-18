# Parser Service

Сервис для парсинга афиши событий с сайта Самарского театра оперы и балета.

## Технологии

- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy (для работы с базой данных)
- Alembic (для миграций базы данных)
- Kafka
- BeautifulSoup4 (для парсинга HTML)
- Docker
- Kubernetes

## Функциональность

- Парсинг событий с сайта Самарского театра оперы и балета:
  - Базовая информация: название, дата, время
  - Дополнительная информация: жанр, режиссер, продолжительность
  - Медиа-контент: ссылки на изображения, детальные страницы
- REST API для ручного запуска парсинга и получения данных
- Прослушивание Kafka для автоматического запуска парсинга
- Сохранение данных в PostgreSQL

## Установка и запуск

### Настройка секретов

Чувствительные данные хранятся в файле `.env.secrets` который не должен попадать в систему контроля версий.

1. Создайте файл `.env.secrets` со следующим содержимым:
```
DB_USER=ваш_пользователь_бд
DB_PASSWORD=ваш_пароль_бд
```

2. Создайте файл `.env` с остальными настройками:
```
DB_HOST=хост_бд
DB_PORT=порт_бд
DB_NAME=имя_бд
KAFKA_BROKER=адрес_kafka
TOPIC=parsing
GROUP_ID=1
```

### Локальный запуск

1. Клонируйте репозиторий

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файлы с настройками (см. раздел "Настройка секретов")

4. Создайте базу данных и применить миграции:
```bash
# Создание базы
createdb имя_бд  # или через psql

# Применение миграций
alembic upgrade head
```

5. Запустите приложение:
```bash
python main.py
```

### Сборка Docker образа

Для сборки Docker образа используется многоэтапная сборка с оптимизацией для размера образа и безопасности:

```bash
# Базовая сборка
docker build -t parser-service:latest .

# Сборка с пользовательскими аргументами
docker build \
  --build-arg APP_USER=myuser \
  --build-arg APP_UID=1001 \
  --build-arg APP_GID=1001 \
  -t parser-service:latest .
```

Также можно использовать Makefile:
```bash
make build
```

### Запуск в Docker

```bash
docker run -d -p 8080:8080 \
  -e DB_USER=ваш_пользователь_бд \
  -e DB_PASSWORD=ваш_пароль_бд \
  -e DB_HOST=хост_бд \
  -e DB_PORT=порт_бд \
  -e DB_NAME=имя_бд \
  -e KAFKA_BROKER=адрес_kafka \
  --name parser-service parser-service:latest
```

Или с помощью Makefile:
```bash
make run-local
```

### Деплой в Kubernetes

Проект содержит готовые конфигурационные файлы для деплоя в Kubernetes (в папке `k8s/`):

1. Создайте секрет с учетными данными:
```bash
# Предварительно отредактируйте k8s/secret.yaml
kubectl apply -f k8s/secret.yaml

# Или с помощью Makefile
make create-secret
```

2. Задеплойте приложение:
```bash
# Вручную
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Или с помощью Makefile
make deploy
```

3. Запустите миграции:
```bash
kubectl exec -it $(kubectl get pods -l app=parser-service -o jsonpath="{.items[0].metadata.name}") -- alembic upgrade head

# Или с помощью Makefile
make run-migrations
```

#### Настройка переменных для деплоя

В Makefile можно настроить следующие переменные:
- `DOCKER_REGISTRY` - адрес Docker registry
- `IMAGE_NAME` - имя образа
- `VERSION` - версия образа
- `APP_USER` - имя пользователя в контейнере
- `APP_UID` - UID пользователя
- `APP_GID` - GID пользователя

Пример:
```bash
make build DOCKER_REGISTRY=my-registry.com VERSION=1.0.0
make push DOCKER_REGISTRY=my-registry.com VERSION=1.0.0
make deploy DOCKER_REGISTRY=my-registry.com VERSION=1.0.0
```

## API Endpoints

- `GET /health` - проверка работоспособности сервиса
- `POST /parse` - запуск парсинга событий
- `GET /events` - получение списка событий из базы данных

## Kafka

Сервис слушает топик `parsing` и реагирует на сообщение `"startOpera"`, запуская парсинг событий.

## Структура базы данных

События сохраняются в таблице `events` базы данных `afisha` в PostgreSQL со следующими полями:

### Основные поля:
- id - первичный ключ
- title - название события
- date - дата проведения
- time - время проведения
- price - цена билета (если доступна)
- place - место проведения
- created_at - время добавления в базу

### Дополнительные поля:
- image_url - URL изображения события
- genre - жанр мероприятия (опера, балет и т.д.)
- duration - продолжительность мероприятия
- director - режиссер/постановщик
- link - ссылка на детальную страницу события
- description - описание события 