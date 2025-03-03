# Используем официальный образ OpenJDK в качестве базового образа
FROM openjdk:21-jdk-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл сборки Gradle и скрипты в контейнер
COPY build.gradle.kts settings.gradle.kts gradlew /app/
COPY gradle /app/gradle

# Копируем исходный код приложения в контейнер
COPY src /app/src

# Скачиваем зависимости и собираем приложение
RUN ./gradlew build --no-daemon

# Копируем собранный JAR файл в контейнер
COPY build/libs/*.jar app.jar

# Указываем команду для запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]

# Указываем порт, который будет использоваться приложением
EXPOSE 8080