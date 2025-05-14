package ru.securitytrip.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.securitytrip.auth_service.model.User;
import ru.securitytrip.auth_service.repository.UserRepository;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        // Пробуем найти пользователя по email
        Optional<User> userOptional = userRepository.findByEmail(login);
        
        // Если не нашли по email, пробуем по name для обратной совместимости
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByName(login);
        }
        
        User user = userOptional.orElseThrow(() -> 
            new UsernameNotFoundException("Пользователь не найден: " + login));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // Используем email для авторизации
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name().toUpperCase()))
        );
    }
}
