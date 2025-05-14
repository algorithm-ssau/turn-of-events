package ru.securitytrip.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Запрос для аутентификации пользователя")
public class LoginRequest {
    @Schema(description = "Электронная почта", example = "user@example.com", required = true)
    private String email;
    
    @Schema(description = "Пароль пользователя", example = "password123", required = true)
    private String password;
}
