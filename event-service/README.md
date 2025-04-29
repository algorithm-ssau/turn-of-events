# Event Service

Сервис для управления событиями и мероприятиями.

## Профили конфигурации

Приложение имеет два профиля конфигурации:
- `default` - для локальной разработки
- `k8s` - для запуска в Kubernetes кластере

## Запуск в Kubernetes

### 1. Создание секрета для доступа к базе данных

```bash
kubectl create secret generic postgres-secret \
  --from-literal='username=gen_user' \
  --from-literal='password=)NJH-8Zc!\U\d\' \
  --from-literal='host=host'
```

### 2. Сборка Docker-образа

```bash
docker build -t event-service:latest .
```

### 3. Загрузка образа в реестр (если требуется)

```bash
# Пример для Docker Hub
docker tag event-service:latest your-registry/event-service:latest
docker push your-registry/event-service:latest

# Обновите image в k8s/deployment.yaml на ваш образ в реестре
```

### 4. Применение манифестов Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

### 5. Проверка статуса деплоя

```bash
kubectl get pods -l app=event-service
kubectl logs -l app=event-service
```

## Как работает подключение к БД в Kubernetes

1. В кластере создается секрет `postgres-secret` с учетными данными для БД
2. В манифесте деплоя указывается профиль `k8s` через переменную `SPRING_PROFILES_ACTIVE`
3. Значения из секрета подставляются как переменные окружения в контейнер
4. Spring Boot считывает переменные окружения и использует их для подключения к БД

## Настройка БД в разных окружениях

### Локальная разработка
```
spring.datasource.url=jdbc:postgresql://postgres:5432/afisha_db
spring.datasource.username=admin
spring.datasource.password=admin123
```

### В кластере Kubernetes
```
spring.datasource.url=jdbc:postgresql://${POSTGRES_HOST}:5432/afisha_db
spring.datasource.username=${POSTGRES_USERNAME}
spring.datasource.password=${POSTGRES_PASSWORD}
``` 