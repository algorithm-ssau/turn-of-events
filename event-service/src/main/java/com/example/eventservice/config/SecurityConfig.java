package com.example.eventservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)  // Отключаем CSRF для REST API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()  // Разрешаем GET запросы всем
                        .requestMatchers("/actuator/**").permitAll()  // Разрешаем доступ к Actuator эндпоинтам
                        .anyRequest().authenticated()  // Остальные запросы только аутентифицированным пользователям
                )
                .httpBasic().and()  // Базовая HTTP аутентификация
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Отключаем сессии
                )
                .build();
    }
} 