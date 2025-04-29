package ru.securitytrip.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Запрос на регистрацию нового пользователя")
public class RegisterRequest {
    @Schema(description = "Имя пользователя", example = "Иван Иванов", required = true)
    private String name;
    
    @Schema(description = "Электронная почта", example = "user@example.com", required = true)
    private String email;
    
    @Schema(description = "Пароль пользователя", example = "securePassword123", required = true)
    private String password;
    
    @Schema(description = "URL аватара пользователя", example = "https://example.com/avatars/avatar.jpg", required = false)
    private String avatarUrl;
}
