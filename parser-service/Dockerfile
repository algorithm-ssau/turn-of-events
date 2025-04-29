FROM python:3.11-slim AS builder

WORKDIR /app

# Аргументы сборки со значениями по умолчанию
ARG PYTHON_ENV=production
ARG APP_USER=appuser
ARG APP_UID=1000
ARG APP_GID=1000

# Установка зависимостей для сборки
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование файлов зависимостей
COPY requirements.txt .

# Установка зависимостей в виртуальное окружение
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Создание непривилегированного пользователя для запуска приложения
RUN groupadd -g $APP_GID $APP_USER && \
    useradd -u $APP_UID -g $APP_GID -m $APP_USER

# Финальный образ
FROM python:3.11-slim

# Аргументы для финального образа
ARG APP_USER=appuser
ARG APP_UID=1000
ARG APP_GID=1000

# Создание пользователя в финальном образе
RUN groupadd -g $APP_GID $APP_USER && \
    useradd -u $APP_UID -g $APP_GID -m $APP_USER

# Установка только необходимых зависимостей для выполнения
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Копирование виртуального окружения из builder
COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

WORKDIR /app

# Копирование исходного кода
COPY . .

# Создание директории для миграций, если её нет
RUN mkdir -p migrations/versions

# Скрипт для запуска миграций и сервиса
RUN echo '#!/bin/bash\n\
# Для K8s: секреты будут монтироваться из секретов Kubernetes\n\
# или передаваться через переменные окружения\n\
\n\
# Применение миграций\n\
echo "Applying database migrations..."\n\
alembic upgrade head\n\
\n\
echo "Starting application..."\n\
exec python main.py\n\
' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Установка прав для непривилегированного пользователя
RUN chown -R $APP_USER:$APP_USER /app

# Переключение на непривилегированного пользователя
USER $APP_USER

# Порт для FastAPI
EXPOSE 8080

# Запуск приложения
CMD ["/app/entrypoint.sh"]
