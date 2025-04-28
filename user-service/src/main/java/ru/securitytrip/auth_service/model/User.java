package ru.securitytrip.auth_service.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.securitytrip.auth_service.data.Role;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность пользователя")
// TODO Change user model according requrements
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Schema(description = "Уникальный идентификатор пользователя", example = "1")
    private Long id;

    @Schema(description = "Имя пользователя", example = "user123")
    private String username;

    @Schema(description = "Зашифрованный пароль пользователя", example = "$2a$10$X7L...")
    private String password;

    @Schema(description = "URL аватара пользователя", example = "http://example.com")
    private String avatarURL;

    @Schema(description = "Email пользователя", example = "example@example.com")
    private String email;

    @Schema(description = "Роль пользователя", example = "admin")
    @Enumerated
    private Role role;
}
