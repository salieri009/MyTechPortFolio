package com.mytechfolio.portfolio.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

/**
 * Validates URL format and scheme security.
 * Prevents:
 * - JavaScript injection (javascript:)
 * - File system access (file://)
 * - Data URI injection (data:)
 */
public class UrlValidator implements ConstraintValidator<ValidUrl, String> {
    
    private boolean allowEmpty;
    private List<String> allowedSchemes;
    
    @Override
    public void initialize(ValidUrl constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.allowedSchemes = Arrays.asList(constraintAnnotation.allowedSchemes());
    }
    
    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        if (url == null || url.trim().isEmpty()) {
            return allowEmpty;
        }
        
        try {
            // Use URI instead of deprecated URL constructor
            URI parsedUri = new URI(url);
            String scheme = parsedUri.getScheme();
            
            if (scheme == null) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("URL must have a scheme")
                    .addConstraintViolation();
                return false;
            }
            
            scheme = scheme.toLowerCase();
            
            // Security: Only allow safe schemes
            if (!allowedSchemes.contains(scheme)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "URL scheme '" + scheme + "' is not allowed. Allowed schemes: " + allowedSchemes
                ).addConstraintViolation();
                return false;
            }
            
            // Security: Validate host to prevent SSRF attacks
            String host = parsedUri.getHost();
            if (host == null || host.isEmpty()) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("URL must have a valid host")
                    .addConstraintViolation();
                return false;
            }
            
            // Security: Block private/internal IPs (basic check)
            if (isPrivateIP(host)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Private/internal IPs are not allowed")
                    .addConstraintViolation();
                return false;
            }
            
            // Security: Maximum URL length to prevent DoS
            if (url.length() > 2048) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("URL exceeds maximum length of 2048 characters")
                    .addConstraintViolation();
                return false;
            }
            
            return true;
        } catch (URISyntaxException e) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Invalid URL format: " + e.getMessage())
                .addConstraintViolation();
            return false;
        }
    }
    
    private boolean isPrivateIP(String host) {
        // Basic check for common private IP patterns
        return host.startsWith("127.") ||
               host.startsWith("192.168.") ||
               host.startsWith("10.") ||
               host.startsWith("172.16.") ||
               host.startsWith("172.17.") ||
               host.startsWith("172.18.") ||
               host.startsWith("172.19.") ||
               host.startsWith("172.20.") ||
               host.startsWith("172.21.") ||
               host.startsWith("172.22.") ||
               host.startsWith("172.23.") ||
               host.startsWith("172.24.") ||
               host.startsWith("172.25.") ||
               host.startsWith("172.26.") ||
               host.startsWith("172.27.") ||
               host.startsWith("172.28.") ||
               host.startsWith("172.29.") ||
               host.startsWith("172.30.") ||
               host.startsWith("172.31.") ||
               host.equals("localhost") ||
               host.equals("0.0.0.0");
    }
}

