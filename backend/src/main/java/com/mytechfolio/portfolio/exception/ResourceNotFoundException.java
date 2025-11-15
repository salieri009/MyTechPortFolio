package com.mytechfolio.portfolio.exception;

/**
 * Custom exception for resource not found scenarios.
 * Reusable across all services.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    private final String resourceName;
    private final String resourceId;
    
    public ResourceNotFoundException(String resourceName, String resourceId) {
        super(String.format("%s not found with id: %s", resourceName, resourceId));
        this.resourceName = resourceName;
        this.resourceId = resourceId;
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.resourceId = null;
    }
    
    public String getResourceName() {
        return resourceName;
    }
    
    public String getResourceId() {
        return resourceId;
    }
}

