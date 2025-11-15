package com.mytechfolio.portfolio.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.util.List;

/**
 * Validates a list of MongoDB ObjectIds.
 * Security: Prevents NoSQL injection and DoS attacks with large lists.
 */
public class MongoIdListValidator implements ConstraintValidator<ValidMongoIdList, List<String>> {
    
    private final MongoIdValidator mongoIdValidator = new MongoIdValidator();
    private boolean allowEmpty;
    private int maxSize;
    
    @Override
    public void initialize(ValidMongoIdList constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.maxSize = constraintAnnotation.maxSize();
        
        ValidMongoId validMongoId = new ValidMongoId() {
            @Override
            public Class<? extends java.lang.annotation.Annotation> annotationType() {
                return ValidMongoId.class;
            }
            
            @Override
            public String message() {
                return "Invalid MongoDB ObjectId";
            }
            
            @Override
            public Class<?>[] groups() {
                return new Class[0];
            }
            
            @Override
            @SuppressWarnings("unchecked")
            public Class<? extends Payload>[] payload() {
                return new Class[0];
            }
            
            @Override
            public boolean allowEmpty() {
                return false;
            }
        };
        
        mongoIdValidator.initialize(validMongoId);
    }
    
    @Override
    public boolean isValid(List<String> ids, ConstraintValidatorContext context) {
        if (ids == null || ids.isEmpty()) {
            return allowEmpty;
        }
        
        // Security: Prevent DoS with extremely large lists
        if (ids.size() > maxSize) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                String.format("List size exceeds maximum of %d items", maxSize)
            ).addConstraintViolation();
            return false;
        }
        
        // Validate each ID
        for (int i = 0; i < ids.size(); i++) {
            String id = ids.get(i);
            if (!mongoIdValidator.isValid(id, context)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    String.format("Invalid MongoDB ObjectId at index %d", i)
                ).addConstraintViolation();
                return false;
            }
        }
        
        return true;
    }
}

