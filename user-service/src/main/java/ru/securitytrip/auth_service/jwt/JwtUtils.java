package ru.securitytrip.auth_service.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret:defaultSecretKeyNeedsToBeChangedInProduction}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private int jwtExpirationMs;
    
    @Value("${jwt.refresh-expiration:604800000}")
    private int refreshExpirationMs;
    
    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }
    
    public int getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        logger.debug("Генерация JWT токена для пользователя: {}", userPrincipal.getUsername());

        return generateTokenFromUsername(userPrincipal.getUsername(), jwtExpirationMs);
    }
    
    public String generateRefreshToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        logger.debug("Генерация Refresh токена для пользователя: {}", userPrincipal.getUsername());

        return generateTokenFromUsername(userPrincipal.getUsername(), refreshExpirationMs);
    }
    
    public String generateTokenFromUsername(String username, int expirationTime) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationTime);
        logger.debug("Токен для {} действителен до: {}", username, expiry);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        String username = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        logger.trace("Извлечено имя пользователя из токена: {}", username);
        return username;
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Невалидный JWT токен: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT токен истек: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT токен не поддерживается: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims строка пуста: {}", e.getMessage());
        } catch (JwtException e) {
            logger.error("Ошибка валидации JWT: {}", e.getMessage());
        }
        return false;
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}
