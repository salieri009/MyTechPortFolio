package com.mytechfolio.portfolio.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Input sanitization utility for security.
 * Prevents XSS and NoSQL injection attacks.
 */
@Component
public class InputSanitizer {

    // Patterns for dangerous content
    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
        "(?i)<script[^>]*>.*?</script>", Pattern.DOTALL
    );
    private static final Pattern JAVASCRIPT_PATTERN = Pattern.compile(
        "(?i)javascript:", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern ON_EVENT_PATTERN = Pattern.compile(
        "(?i)on\\w+\\s*=", Pattern.CASE_INSENSITIVE
    );
    
    /**
     * Sanitizes HTML content to prevent XSS attacks.
     * Allows basic markdown but removes dangerous tags and attributes.
     */
    public String sanitizeHtml(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        
        String sanitized = input;
        
        // Remove script tags
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        
        // Remove javascript: protocol
        sanitized = JAVASCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        
        // Remove event handlers (onclick, onerror, etc.)
        sanitized = ON_EVENT_PATTERN.matcher(sanitized).replaceAll("");
        
        // Remove dangerous HTML tags
        sanitized = sanitized.replaceAll("(?i)<iframe[^>]*>.*?</iframe>", "");
        sanitized = sanitized.replaceAll("(?i)<object[^>]*>.*?</object>", "");
        sanitized = sanitized.replaceAll("(?i)<embed[^>]*>", "");
        sanitized = sanitized.replaceAll("(?i)<link[^>]*>", "");
        sanitized = sanitized.replaceAll("(?i)<meta[^>]*>", "");
        
        return sanitized.trim();
    }
    
    /**
     * Sanitizes text input by removing potentially dangerous characters.
     */
    public String sanitizeText(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        
        // Remove control characters except newline and tab
        String sanitized = input.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        
        // Trim whitespace
        sanitized = sanitized.trim();
        
        return sanitized;
    }
    
    /**
     * Validates and sanitizes URL input.
     */
    public String sanitizeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return url;
        }
        
        String sanitized = url.trim();
        
        // Remove javascript: and data: protocols
        sanitized = JAVASCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = sanitized.replaceAll("(?i)data:", "");
        
        // Remove dangerous characters
        sanitized = sanitized.replaceAll("[<>\"'`]", "");
        
        return sanitized;
    }
    
    /**
     * Sanitizes MongoDB query input to prevent NoSQL injection.
     */
    public String sanitizeMongoQuery(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        
        // Remove MongoDB operators that could be used for injection
        String sanitized = input
            .replaceAll("\\$", "")
            .replaceAll("\\{", "")
            .replaceAll("\\}", "");
        
        return sanitized.trim();
    }
}

