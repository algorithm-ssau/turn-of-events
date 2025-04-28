package ru.securitytrip.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.securitytrip.auth_service.dto.LoginRequest;
import ru.securitytrip.auth_service.dto.LoginResponse;
import ru.securitytrip.auth_service.dto.RefreshTokenRequest;
import ru.securitytrip.auth_service.dto.RefreshTokenResponse;
import ru.securitytrip.auth_service.dto.RegisterRequest;
import ru.securitytrip.auth_service.dto.RegisterResponse;
import ru.securitytrip.auth_service.jwt.JwtUtils;
import ru.securitytrip.auth_service.model.User;
import ru.securitytrip.auth_service.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        logger.debug("Попытка аутентификации пользователя: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);
        logger.debug("JWT токен и Refresh токен успешно сгенерированы");

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        logger.debug("Пользователь найден в базе данных, userId: {}", user.getId());

        return new LoginResponse(jwt, refreshToken, user.getUsername(), user.getId());
    }
    
    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshRequest) {
        logger.debug("Попытка обновления токена");
        
        String refreshToken = refreshRequest.getRefreshToken();
        
        if (!jwtUtils.validateJwtToken(refreshToken)) {
            logger.warn("Невалидный refresh токен");
            throw new RuntimeException("Refresh токен невалиден или истек");
        }
        
        String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
        logger.debug("Обновление токена для пользователя: {}", username);
        
        // Генерируем новый access токен
        String newAccessToken = jwtUtils.generateTokenFromUsername(username, jwtUtils.getJwtExpirationMs());
        
        // Возвращаем новые токены
        RefreshTokenResponse response = new RefreshTokenResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(refreshToken);
        return response;
    }

    public RegisterResponse registerUser(RegisterRequest registerRequest) {
        logger.debug("Попытка регистрации пользователя: {}", registerRequest.getUsername());

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            logger.warn("Пользователь с именем {} уже существует", registerRequest.getUsername());
            return new RegisterResponse("Пользователь с таким именем уже существует", false);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        logger.debug("Сохранение нового пользователя в базу данных");
        userRepository.save(user);
        logger.info("Пользователь {} успешно зарегистрирован", registerRequest.getUsername());

        return new RegisterResponse("Пользователь успешно зарегистрирован", true);
    }
}