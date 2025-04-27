# Базовый образ
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код проекта
COPY . .

# Собираем проект
RUN npm run build

# Второй этап - создание минимального образа
FROM node:20-alpine

WORKDIR /app

# Копируем файлы из builder-контейнера
COPY --from=builder /app ./

# Открываем порт
EXPOSE 5173

# Запускаем приложение
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
