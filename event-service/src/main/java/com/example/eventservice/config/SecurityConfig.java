package com.example.eventservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)  // Отключаем CSRF для REST API
                .httpBasic(AbstractHttpConfigurer::disable)  // Отключаем HTTP Basic, т.к. используем JWT в API Gateway
                .formLogin(AbstractHttpConfigurer::disable)  // Отключаем форму логина
                .authorizeHttpRequests(auth -> auth
                        // Разрешаем доступ к публичным эндпоинтам всем
                        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Отключаем сессии
                )
                .addFilterBefore(new ApiGatewayAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * Фильтр для проверки и применения аутентификации от API Gateway
     */
    private static class ApiGatewayAuthenticationFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            
            // Проверяем наличие заголовков от API Gateway
            String username = request.getHeader("X-Auth-User");
            String roles = request.getHeader("X-Auth-Roles");
            
            // Если заголовки аутентификации есть, устанавливаем аутентификацию в контекст безопасности
            if (username != null && !username.isEmpty()) {
                List<SimpleGrantedAuthority> authorities = Collections.emptyList();
                
                // Если есть роли, преобразуем их в GrantedAuthority
                if (roles != null && !roles.isEmpty()) {
                    authorities = Arrays.stream(roles.split(","))
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.trim()))
                            .collect(Collectors.toList());
                }
                
                // Создаем объект аутентификации и устанавливаем его в контекст
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            
            filterChain.doFilter(request, response);
        }
    }
} 