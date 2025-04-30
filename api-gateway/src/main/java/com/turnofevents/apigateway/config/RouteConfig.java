package com.turnofevents.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Публичный маршрут для GET запросов к событиям
                .route("public-events", r -> r
                        .path("/api/events/**")
                        .and()
                        .method(HttpMethod.GET)
                        .uri("http://event_service:8080/")
                )
                
                // Защищенный маршрут для POST, PUT, DELETE запросов к событиям
                // (требуют аутентификации через API Gateway)
                .route("protected-events", r -> r
                        .path("/api/events/**")
                        .and()
                        .method(HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                        .uri("http://event_service:8080/")
                )
                
                // Маршрут для сервиса пользователей
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/api/user/${segment}"))
                        .uri("http://user_service:8000/")
                )
                
                // Маршрут для авторизации
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.rewritePath("/api/auth/(?<segment>.*)", "/auth/${segment}"))
                        .uri("http://user_service:8080/")
                )
                .build();
    }
} 