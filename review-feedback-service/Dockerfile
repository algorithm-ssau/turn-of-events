# Stage 1: Сборка приложения с использованием Maven
FROM maven:3.8.6-openjdk-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src/ src/
RUN mvn package -DskipTests

# Stage 2: Запуск приложения на базе OpenJDK 21
FROM openjdk:21-jdk
WORKDIR /app
COPY --from=build /app/target/review_backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5632
ENTRYPOINT ["java", "-jar", "app.jar"]