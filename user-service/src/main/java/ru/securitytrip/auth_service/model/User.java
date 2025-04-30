package ru.securitytrip.auth_service.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import ru.securitytrip.auth_service.data.Role;

import java.util.Collection;
import java.util.Collections;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор пользователя", example = "1")
    private Long id;

    @Column(nullable = false, name = "name")
    @Schema(description = "Имя пользователя", example = "Иван Иванов")
    private String name;

    @Column(nullable = false)
    @Schema(description = "Зашифрованный пароль пользователя", example = "$2a$10$X7L...")
    private String password;

    @Column(nullable = true)
    @Schema(description = "URL аватара пользователя", example = "https://example.com/avatars/avatar.jpg")
    private String avatarURL;

    @Column(nullable = false, unique = true)
    @Schema(description = "Email пользователя (используется для входа)", example = "user@example.com")
    private String email;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Роль пользователя", example = "USER")
    private Role role;
    
    /**
     * Возвращает список привилегий пользователя для Spring Security
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name().toUpperCase()));
    }
    
    /**
     * Для совместимости со старым кодом
     * Использует свойство name для поддержки findByUsername
     */
    @Transient
    public String getUsername() {
        return name;
    }
    
    /**
     * Для совместимости со старым кодом
     */
    public void setUsername(String username) {
        this.name = username;
    }
}
