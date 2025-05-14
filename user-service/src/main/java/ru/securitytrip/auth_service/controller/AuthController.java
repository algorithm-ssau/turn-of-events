package ru.securitytrip.auth_service.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.securitytrip.auth_service.dto.LoginRequest;
import ru.securitytrip.auth_service.dto.LoginResponse;
import ru.securitytrip.auth_service.dto.RefreshTokenRequest;
import ru.securitytrip.auth_service.dto.RefreshTokenResponse;
import ru.securitytrip.auth_service.dto.RegisterRequest;
import ru.securitytrip.auth_service.dto.RegisterResponse;
import ru.securitytrip.auth_service.service.AuthService;

@RestController
@RequestMapping("/auth")
@Tag(name = "Аутентификация", description = "API для аутентификации и регистрации пользователей")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Operation(summary = "Вход в систему", description = "Аутентификация пользователя по email и получение JWT-токена")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешная аутентификация",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Неверные учетные данные",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Получен запрос на аутентификацию по email: {}", loginRequest.getEmail());
        try {
            LoginResponse response = authService.authenticateUser(loginRequest);
            logger.info("Успешная аутентификация пользователя с email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Ошибка при аутентификации пользователя с email {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @Operation(summary = "Обновление токена", description = "Обновление JWT-токена по refresh токену")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Токен успешно обновлен",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RefreshTokenResponse.class))),
            @ApiResponse(responseCode = "401", description = "Невалидный refresh токен",
                    content = @Content)
    })
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest refreshRequest) {
        logger.info("Получен запрос на обновление токена");
        try {
            RefreshTokenResponse response = authService.refreshToken(refreshRequest);
            logger.info("Токен успешно обновлен");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Ошибка при обновлении токена: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @Operation(summary = "Регистрация нового пользователя", description = "Создание нового аккаунта пользователя с email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешная регистрация",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RegisterResponse.class))),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации или email уже зарегистрирован",
                    content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        logger.info("Получен запрос на регистрацию пользователя: {}, email: {}", 
                registerRequest.getName(), registerRequest.getEmail());
        
        RegisterResponse response = authService.registerUser(registerRequest);

        if (response.isSuccess()) {
            logger.info("Пользователь успешно зарегистрирован: {}, email: {}", 
                    registerRequest.getName(), registerRequest.getEmail());
            return ResponseEntity.ok(response);
        } else {
            logger.warn("Не удалось зарегистрировать пользователя {}, email {}: {}",
                    registerRequest.getName(), registerRequest.getEmail(), response.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}
