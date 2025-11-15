package com.mytechfolio.portfolio.config;

import com.mytechfolio.portfolio.constants.ApiConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for CORS and other web-related settings.
 * Configures CORS policy for cross-origin requests.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:#{T(com.mytechfolio.portfolio.constants.ApiConstants).DEFAULT_ALLOWED_ORIGINS}}")
    private String[] allowedOrigins;

    @Value("${cors.allowed-methods:#{T(com.mytechfolio.portfolio.constants.ApiConstants).DEFAULT_ALLOWED_METHODS}}")
    private String[] allowedMethods;

    @Value("${cors.allowed-headers:#{T(com.mytechfolio.portfolio.constants.ApiConstants).DEFAULT_ALLOWED_HEADERS}}")
    private String[] allowedHeaders;

    @Value("${cors.max-age:" + ApiConstants.CORS_MAX_AGE + "}")
    private long maxAge;

    @Value("${cors.allow-credentials:false}")
    private boolean allowCredentials;

    /**
     * Configures CORS mappings for API endpoints.
     * Uses constants for default values but allows external configuration.
     * 
     * @param registry CORS registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(ApiConstants.API_BASE_PATH + "/**")
                .allowedOriginPatterns(allowedOrigins)
                .allowedMethods(allowedMethods)
                .allowedHeaders(allowedHeaders)
                .allowCredentials(allowCredentials)
                .maxAge(maxAge)
                // Expose custom headers for frontend
                .exposedHeaders("X-Request-ID", "X-Response-Time", "X-Rate-Limit-Remaining");
    }
}
