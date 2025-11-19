package com.mytechfolio.portfolio.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MongoIdValidatorTest {

    private MongoIdValidator validator;
    
    @Mock
    private ConstraintValidatorContext context;
    
    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder violationBuilder;
    
    @BeforeEach
    void setUp() {
        validator = new MongoIdValidator();
        ValidMongoId annotation = mock(ValidMongoId.class);
        when(annotation.allowEmpty()).thenReturn(false);
        validator.initialize(annotation);
    }

    @Test
    void shouldReturnTrueForValidMongoId() {
        // Given
        String validId = "507f1f77bcf86cd799439011";
        
        // When
        boolean result = validator.isValid(validId, context);
        
        // Then
        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnFalseForInvalidMongoId() {
        // Given
        String invalidId = "invalid-id";
        
        doNothing().when(context).disableDefaultConstraintViolation();
        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(violationBuilder);
        when(violationBuilder.addConstraintViolation()).thenReturn(context);
        
        // When
        boolean result = validator.isValid(invalidId, context);
        
        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldReturnFalseForNullId() {
        // Given
        String nullId = null;
        
        // When
        boolean result = validator.isValid(nullId, context);
        
        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldReturnFalseForEmptyId() {
        // Given
        String emptyId = "";
        
        // When
        boolean result = validator.isValid(emptyId, context);
        
        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldReturnFalseForIdWithInvalidCharacters() {
        // Given
        String invalidId = "507f1f77bcf86cd79943901$"; // Contains $
        
        doNothing().when(context).disableDefaultConstraintViolation();
        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(violationBuilder);
        when(violationBuilder.addConstraintViolation()).thenReturn(context);
        
        // When
        boolean result = validator.isValid(invalidId, context);
        
        // Then
        assertThat(result).isFalse();
    }
}

