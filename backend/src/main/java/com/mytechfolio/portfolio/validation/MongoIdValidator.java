package com.mytechfolio.portfolio.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validates MongoDB ObjectId format.
 * Security: Prevents NoSQL injection by ensuring only valid ObjectIds are accepted.
 * 
 * MongoDB ObjectId format: 24 hexadecimal characters
 */
public class MongoIdValidator implements ConstraintValidator<ValidMongoId, String> {
    
    // MongoDB ObjectId: exactly 24 hexadecimal characters
    private static final Pattern MONGO_ID_PATTERN = Pattern.compile("^[0-9a-fA-F]{24}$");
    
    private boolean allowEmpty;
    
    @Override
    public void initialize(ValidMongoId constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }
    
    @Override
    public boolean isValid(String id, ConstraintValidatorContext context) {
        if (id == null || id.trim().isEmpty()) {
            return allowEmpty;
        }
        
        // Security: Validate format to prevent NoSQL injection
        if (!MONGO_ID_PATTERN.matcher(id.trim()).matches()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "Invalid MongoDB ObjectId format. Must be exactly 24 hexadecimal characters."
            ).addConstraintViolation();
            return false;
        }
        
        // Security: Additional check for suspicious patterns
        String lowerId = id.toLowerCase();
        if (lowerId.contains("$") || lowerId.contains("{") || lowerId.contains("}")) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "ObjectId contains invalid characters"
            ).addConstraintViolation();
            return false;
        }
        
        return true;
    }
}

