# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап деплоя на nginx
FROM nginx:alpine

# Копируем собранные файлы в nginx
COPY --from=builder /app/dist /usr/share/nginx/html/organizer

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
