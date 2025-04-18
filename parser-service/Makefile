# Переменные для сборки и деплоя
DOCKER_REGISTRY ?= localhost:5000
IMAGE_NAME ?= parser-service
VERSION ?= latest
APP_USER ?= appuser
APP_UID ?= 1000
APP_GID ?= 1000

# Сборка Docker образа
build:
	docker build \
		--build-arg APP_USER=$(APP_USER) \
		--build-arg APP_UID=$(APP_UID) \
		--build-arg APP_GID=$(APP_GID) \
		-t $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) .

# Пуш образа в registry
push:
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION)

# Применение конфигурации Kubernetes
deploy:
	sed "s|\$${DOCKER_REGISTRY}|$(DOCKER_REGISTRY)|g; s|\$${VERSION}|$(VERSION)|g" k8s/deployment.yaml | kubectl apply -f -
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/configmap.yaml

# Создание секрета (предварительно нужно настроить значения в secret.yaml)
create-secret:
	kubectl apply -f k8s/secret.yaml

# Запуск миграций в Kubernetes
run-migrations:
	kubectl exec -it $$(kubectl get pods -l app=parser-service -o jsonpath="{.items[0].metadata.name}") -- alembic upgrade head

# Локальный запуск в Docker
run-local:
	docker run -d --name $(IMAGE_NAME) \
		-p 8080:8080 \
		-e DB_USER=gen_user \
		-e DB_PASSWORD=")NJH-8Zc!\U\d\" \
		-e DB_HOST=localhost \
		-e DB_PORT=5432 \
		-e DB_NAME=afisha \
		-e KAFKA_BROKER=localhost:29092 \
		$(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION)

# Остановка и удаление локального контейнера
stop-local:
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

# Очистка старых образов
clean:
	docker rmi $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) || true

# Помощь
help:
	@echo "Доступные команды:"
	@echo "  make build          - Сборка Docker образа"
	@echo "  make push           - Пуш образа в registry"
	@echo "  make deploy         - Деплой в Kubernetes"
	@echo "  make create-secret  - Создание секрета в Kubernetes"
	@echo "  make run-migrations - Запуск миграций в Kubernetes"
	@echo "  make run-local      - Локальный запуск в Docker"
	@echo "  make stop-local     - Остановка локального контейнера"
	@echo "  make clean          - Очистка старых образов"

.PHONY: build push deploy create-secret run-migrations run-local stop-local clean help 