package ru.securitytrip.auth_service.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class SwaggerRedirectController {

    @GetMapping("/")
    public RedirectView redirectToSwagger() {
        return new RedirectView("/swagger-ui.html");
    }

    @GetMapping("/api-docs")
    public RedirectView redirectToApiDocs() {
        return new RedirectView("/v3/api-docs");
    }
} 