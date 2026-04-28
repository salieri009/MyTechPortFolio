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
    
    // Infrastructure Endpoints (no authentication required, any method)
    public static final String[] INFRASTRUCTURE_ENDPOINTS = {
        "/uploads/**",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/actuator/health",
        "/actuator/info"
    };

    // Public Auth Endpoints (no authentication required)
    public static final String[] PUBLIC_AUTH_POST_ENDPOINTS = {
        "/api/v1/auth/google",
        "/api/v1/auth/github",
        "/api/v1/auth/refresh",
        "/api/v1/auth/2fa/verify"
    };

    // Authenticated Auth Endpoints
    public static final String[] AUTH_REQUIRED_AUTH_ENDPOINTS = {
        "/api/v1/auth/logout",
        "/api/v1/auth/profile",
        "/api/v1/auth/2fa/setup",
        "/api/v1/auth/2fa/confirm"
    };

    // Public Read-Only Endpoints (GET only, no authentication required)
    public static final String[] PUBLIC_GET_ENDPOINTS = {
        "/api/v1/projects/**",
        "/api/v1/academics/**",
        "/api/v1/techstacks/**",
        "/api/v1/journey-milestones/**",
        "/api/v1/seo/**",
        "/api/v1/testimonials/**",
        "/api/v1/resumes/**",
        "/api/v1/engagement/**",
        "/api/v1/projects/*/media/**"
    };

    // Public Write Endpoints (POST allowed without admin, e.g., contact form, engagement tracking)
    public static final String[] PUBLIC_POST_ENDPOINTS = {
        "/api/v1/contact",
        "/api/v1/engagement/**"
    };

    // Public patch endpoints (used by client-side engagement updates)
    public static final String[] PUBLIC_PATCH_ENDPOINTS = {
        "/api/v1/engagement/**"
    };

    // Admin Endpoints (require ADMIN role)
    public static final String[] ADMIN_ENDPOINTS = {
        "/api/v1/admin/**"
    };
}

