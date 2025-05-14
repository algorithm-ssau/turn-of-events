package ru.securitytrip.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ на запрос обновления токена")
public class RefreshTokenResponse {
    @Schema(description = "Новый JWT токен для авторизации", example = "eyJhbGciOiJIUzI1NiJ9...", required = true)
    private String accessToken;
    
    @Schema(description = "Новый refresh токен", example = "eyJhbGciOiJIUzI1NiJ9...", required = true)
    private String refreshToken;
} 