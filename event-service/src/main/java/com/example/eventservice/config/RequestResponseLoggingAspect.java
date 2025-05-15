package com.example.eventservice.config;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class RequestResponseLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLoggingAspect.class);

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restController() {}

    @Before("restController()")
    public void logRequest(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            logger.info("[REQUEST] {} {}", request.getMethod(), request.getRequestURI() + (request.getQueryString() != null ? ("?" + request.getQueryString()) : ""));
        }
    }

    @AfterReturning(pointcut = "restController()", returning = "result")
    public void logResponse(JoinPoint joinPoint, Object result) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            logger.info("[RESPONSE] {} {} -> {}", request.getMethod(), request.getRequestURI(), result != null ? result.getClass().getSimpleName() : "null");
        }
    }
}
