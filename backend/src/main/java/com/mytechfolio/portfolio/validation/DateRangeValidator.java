package com.mytechfolio.portfolio.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;
import java.time.LocalDate;

/**
 * Validates that end date is after start date.
 */
public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {
    
    private String startDateField;
    private String endDateField;
    
    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.startDateField = constraintAnnotation.startDateField();
        this.endDateField = constraintAnnotation.endDateField();
    }
    
    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        try {
            Field startField = obj.getClass().getDeclaredField(startDateField);
            Field endField = obj.getClass().getDeclaredField(endDateField);
            
            startField.setAccessible(true);
            endField.setAccessible(true);
            
            LocalDate startDate = (LocalDate) startField.get(obj);
            LocalDate endDate = (LocalDate) endField.get(obj);
            
            if (startDate == null || endDate == null) {
                return true; // Let @NotNull handle null validation
            }
            
            // Security: End date must be after start date
            // Also check reasonable date range (not more than 50 years in the future)
            LocalDate maxFutureDate = LocalDate.now().plusYears(50);
            
            if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "End date must be after start date"
                ).addConstraintViolation();
                return false;
            }
            
            if (startDate.isAfter(maxFutureDate) || endDate.isAfter(maxFutureDate)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "Dates cannot be more than 50 years in the future"
                ).addConstraintViolation();
                return false;
            }
            
            // Security: Start date should not be too far in the past (reasonable limit)
            LocalDate minPastDate = LocalDate.now().minusYears(20);
            if (startDate.isBefore(minPastDate)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "Start date cannot be more than 20 years in the past"
                ).addConstraintViolation();
                return false;
            }
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

