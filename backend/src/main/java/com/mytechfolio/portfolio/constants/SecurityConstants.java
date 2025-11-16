package com.mytechfolio.portfolio.constants;

/**
 * Security-related constants.
 * Centralizes security configuration values.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public final class SecurityConstants {
    
    private SecurityConstants() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
    
    // Password Encoding
    public static final int BCRYPT_STRENGTH = 12; // Recommended strength for production
    
    // JWT Configuration
    public static final long JWT_EXPIRATION_MS = 86400000L; // 24 hours
    public static final long JWT_REFRESH_EXPIRATION_MS = 604800000L; // 7 days
    
    // Rate Limiting
    public static final int RATE_LIMIT_REQUESTS_PER_MINUTE = 60;
    public static final int RATE_LIMIT_AUTH_REQUESTS_PER_MINUTE = 5;
    
    // Session Management
    public static final int MAX_SESSIONS_PER_USER = 5;
    public static final long SESSION_TIMEOUT_SECONDS = 1800L; // 30 minutes
    
    // Security Headers
    public static final String SECURITY_HEADER_CONTENT_TYPE = "nosniff";
    public static final String SECURITY_HEADER_XSS_PROTECTION = "1; mode=block";
    public static final String SECURITY_HEADER_STRICT_TRANSPORT = "max-age=31536000; includeSubDomains";
    
    // Public Endpoints (no authentication required)
    public static final String[] PUBLIC_ENDPOINTS = {
        "/api/v1/auth/**",
        "/api/v1/projects/**",
        "/api/v1/academics/**",
        "/api/v1/techstacks/**",
        "/api/v1/seo/**",
        "/api/v1/testimonials/**",
        "/uploads/**",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/actuator/health",
        "/actuator/info"
    };
    
    // Admin Endpoints (require admin role)
    public static final String[] ADMIN_ENDPOINTS = {
        "/api/v1/admin/**"
    };
}

