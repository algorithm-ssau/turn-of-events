package com.turnofevents.apigateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ApiDocsAggregatorController {

    private final RouteLocator routeLocator;

    @Autowired
    public ApiDocsAggregatorController(RouteLocator routeLocator) {
        this.routeLocator = routeLocator;
    }

    @GetMapping("/aggregated-api-docs")
    public List<Map<String, String>> getAggregatedApiDocs() {
        List<Map<String, String>> aggregatedDocs = new ArrayList<>();

        // Пример: отфильтровать маршруты, имена которых начинаются с "user-service"
        routeLocator.getRoutes()
                .filter(route -> route.getId().equals("user-service"))
                .subscribe(route -> {
                    // Добавляем документ от сервиса с фиктивным названием и URL
                    aggregatedDocs.add(Map.of(
                            "name", "User Service",
                            "url", "/user-service/api/docs"
                    ));
                });

        return aggregatedDocs;
    }
}


