# Используем официальный образ Node.js
FROM node:22-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

# Открываем порт (если NestJS слушает 3000)
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]