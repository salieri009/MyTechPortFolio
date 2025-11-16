package com.mytechfolio.portfolio.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.ArrayList;
import java.util.List;

/**
 * Validates essential environment variables at application startup.
 * Prevents runtime errors by failing fast if required configuration is missing.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Configuration
public class EnvironmentValidationConfig {
    
    private final Environment environment;
    private final String activeProfile;
    
    public EnvironmentValidationConfig(Environment environment) {
        this.environment = environment;
        this.activeProfile = environment.getActiveProfiles().length > 0 
            ? environment.getActiveProfiles()[0] 
            : "default";
    }
    
    /**
     * Validates environment variables after bean initialization.
     * Throws IllegalStateException if required variables are missing.
     */
    @PostConstruct
    public void validateEnvironment() {
        log.info("Validating environment variables for profile: {}", activeProfile);
        
        List<String> missingVars = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        // MongoDB URI - required in production
        if ("prod".equals(activeProfile)) {
            String mongoUri = environment.getProperty("spring.data.mongodb.uri");
            if (mongoUri == null || mongoUri.trim().isEmpty() || mongoUri.contains("localhost")) {
                missingVars.add("MONGODB_URI (spring.data.mongodb.uri)");
            }
        }
        
        // JWT Secret - required in production (must not be default)
        if ("prod".equals(activeProfile)) {
            String jwtSecret = environment.getProperty("app.jwt.secret");
            if (jwtSecret == null || jwtSecret.trim().isEmpty() || 
                jwtSecret.contains("demo-jwt-secret")) {
                missingVars.add("JWT_SECRET (app.jwt.secret) - must not be default value");
            }
        }
        
        // Google OAuth - required in production
        if ("prod".equals(activeProfile)) {
            String googleClientId = environment.getProperty("spring.security.oauth2.client.registration.google.client-id");
            String googleClientSecret = environment.getProperty("spring.security.oauth2.client.registration.google.client-secret");
            
            if (googleClientId == null || googleClientId.trim().isEmpty()) {
                missingVars.add("GOOGLE_CLIENT_ID");
            }
            if (googleClientSecret == null || googleClientSecret.trim().isEmpty()) {
                missingVars.add("GOOGLE_CLIENT_SECRET");
            }
        }
        
        // Email configuration - optional but recommended
        String emailEnabled = environment.getProperty("app.email.enabled", "true");
        if ("true".equalsIgnoreCase(emailEnabled)) {
            String mailHost = environment.getProperty("spring.mail.host");
            String mailUsername = environment.getProperty("spring.mail.username");
            String mailPassword = environment.getProperty("spring.mail.password");
            
            if (mailHost == null || mailHost.trim().isEmpty()) {
                warnings.add("MAIL_HOST (spring.mail.host) - email functionality may not work");
            }
            if (mailUsername == null || mailUsername.trim().isEmpty()) {
                warnings.add("MAIL_USERNAME (spring.mail.username) - email functionality may not work");
            }
            if (mailPassword == null || mailPassword.trim().isEmpty()) {
                warnings.add("MAIL_PASSWORD (spring.mail.password) - email functionality may not work");
            }
        }
        
        // Log validation results
        if (!missingVars.isEmpty()) {
            String errorMessage = String.format(
                "Missing required environment variables for profile '%s':\n%s\n" +
                "Please set these variables before starting the application.",
                activeProfile,
                String.join("\n", missingVars.stream().map(v -> "  - " + v).toArray(String[]::new))
            );
            log.error(errorMessage);
            throw new IllegalStateException(errorMessage);
        }
        
        if (!warnings.isEmpty()) {
            log.warn("Environment variable warnings:\n{}", 
                String.join("\n", warnings.stream().map(w -> "  - " + w).toArray(String[]::new)));
        }
        
        log.info("Environment validation completed successfully for profile: {}", activeProfile);
    }
}

