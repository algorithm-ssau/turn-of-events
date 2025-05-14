package ru.securitytrip.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.securitytrip.auth_service.data.Role;
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

    @Autowired
    private UserDetailsService userDetailsService;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        logger.debug("Попытка аутентификации пользователя по email: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);
        logger.debug("JWT токен и Refresh токен успешно сгенерированы");

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        logger.debug("Пользователь найден в базе данных, userId: {}", user.getId());

        return new LoginResponse(jwt, refreshToken, user.getName(), user.getId());
    }

    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        try {
            if (!jwtUtils.validateJwtToken(refreshTokenRequest.getRefreshToken())) {
                logger.warn("Невалидный refresh token");
                throw new RuntimeException("Refresh token невалиден");
            }

            // Получаем email из токена (subject в JWT)
            String userEmail = jwtUtils.getUserEmailFromJwtToken(refreshTokenRequest.getRefreshToken());
            logger.debug("Email извлечен из refresh токена: {}", userEmail);

            // Получаем UserDetails через сервис Spring Security
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // Создаем аутентификацию без пароля (токен уже проверен)
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            // Генерируем новые токены
            String newAccessToken = jwtUtils.generateJwtToken(authentication);
            String newRefreshToken = jwtUtils.generateRefreshToken(authentication);
            logger.debug("Новый access token и refresh token сгенерированы для пользователя: {}", userEmail);

            return new RefreshTokenResponse(newAccessToken, newRefreshToken);
        } catch (Exception e) {
            logger.error("Ошибка при обновлении токена: {}", e.getMessage());
            throw new RuntimeException("Не удалось обновить токен", e);
        }
    }

    public RegisterResponse registerUser(RegisterRequest registerRequest) {
        logger.debug("Попытка регистрации пользователя: {}", registerRequest.getName());

        // Проверяем, существует ли пользователь с таким email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Пользователь с email {} уже существует", registerRequest.getEmail());
            return new RegisterResponse("Пользователь с таким email уже существует", false);
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER);
        
        // Устанавливаем аватар, если он указан
        if (registerRequest.getAvatarUrl() != null && !registerRequest.getAvatarUrl().isEmpty()) {
            user.setAvatarURL(registerRequest.getAvatarUrl());
        }

        logger.debug("Сохранение нового пользователя в базу данных");
        userRepository.save(user);
        logger.info("Пользователь {} успешно зарегистрирован", registerRequest.getName());

        return new RegisterResponse("Пользователь успешно зарегистрирован", true);
    }
}