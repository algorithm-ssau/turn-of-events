package ru.securitytrip.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.securitytrip.auth_service.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    
    // Для обратной совместимости - используем запрос JPQL для маппинга на name
    @Query("SELECT u FROM User u WHERE u.name = :username")
    Optional<User> findByUsername(@Param("username") String username);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.name = :username")
    boolean existsByUsername(@Param("username") String username);
}
