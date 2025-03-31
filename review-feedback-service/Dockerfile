# Этап сборки приложения с помощью Maven
FROM maven:3.8.6-openjdk-17-slim AS build
WORKDIR /build
# Копируем pom.xml и загружаем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline
# Копируем исходный код
COPY src ./src
# Собираем jar (обычный и fat jar, если настроено)
RUN mvn clean package

# Фаза запуска приложения
FROM openjdk:17-jdk-slim
WORKDIR /app
# Копируем fat jar из предыдущего этапа
COPY --from=build /build/target/review-feedback-service-1.0-SNAPSHOT.jar app.jar
EXPOSE 5632
ENTRYPOINT ["java", "-jar", "app.jar"]