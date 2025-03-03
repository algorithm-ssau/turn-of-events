package ru.securitytrip.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.securitytrip.user_service.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
