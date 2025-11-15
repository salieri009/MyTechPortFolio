package com.mytechfolio.portfolio.constants;

/**
 * API-related constants for the application.
 * Centralizes all API paths, versions, and configuration values.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public final class ApiConstants {
    
    private ApiConstants() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
    
    // API Versioning
    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;
    
    // API Endpoints
    public static final String PROJECTS_ENDPOINT = API_BASE_PATH + "/projects";
    public static final String ACADEMICS_ENDPOINT = API_BASE_PATH + "/academics";
    public static final String TECH_STACKS_ENDPOINT = API_BASE_PATH + "/techstacks";
    public static final String AUTH_ENDPOINT = API_BASE_PATH + "/auth";
    public static final String HEALTH_ENDPOINT = "/actuator/health";
    
    // Pagination Defaults
    public static final int DEFAULT_PAGE_NUMBER = 1;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "endDate";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Security
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    
    // CORS
    public static final String[] DEFAULT_ALLOWED_ORIGINS = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://salieri009.studio"
    };
    
    public static final String[] DEFAULT_ALLOWED_METHODS = {
        "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
    };
    
    public static final String[] DEFAULT_ALLOWED_HEADERS = {
        "Content-Type", "Authorization", "X-Requested-With"
    };
    
    public static final long CORS_MAX_AGE = 3600L; // 1 hour
    
    // Swagger/OpenAPI
    public static final String SWAGGER_UI_PATH = "/swagger-ui.html";
    public static final String API_DOCS_PATH = "/v3/api-docs";
    
    // Error Messages
    public static final String ERROR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERROR_DUPLICATE_RESOURCE = "Resource already exists";
    public static final String ERROR_VALIDATION_FAILED = "Validation failed";
    public static final String ERROR_INTERNAL_SERVER = "Internal server error";
    public static final String ERROR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERROR_FORBIDDEN = "Access forbidden";
}

