FROM python:3.10-slim

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование файла с зависимостями и установка пакетов
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Копирование всего проекта в контейнер
COPY . .

# Указываем порт, который будет использоваться приложением
EXPOSE 8000

# Команда для запуска uvicorn-сервера
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]