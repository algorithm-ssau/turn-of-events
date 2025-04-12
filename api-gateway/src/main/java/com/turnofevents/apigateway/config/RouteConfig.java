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
                // Публичные API мероприятий (без авторизации)
                .route("public-events", r -> r
                        .path("/api/public/events/**")
                        .and()
                        .method(HttpMethod.GET)
                        .uri("http://event-service:8080/")
                )
                // Swagger документация
                .route("api-docs", r -> r
                        .path("/api-docs/**")
                        .uri("forward:/api-docs")
                )
                .build();
    }
} 