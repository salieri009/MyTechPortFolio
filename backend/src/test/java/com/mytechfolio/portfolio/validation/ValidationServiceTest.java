package com.mytechfolio.portfolio.validation;

import com.mytechfolio.portfolio.exception.DuplicateResourceException;
import com.mytechfolio.portfolio.repository.ContactRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidationServiceTest {

    @Mock
    private ContactRepository contactRepository;
    
    @InjectMocks
    private ValidationService validationService;

    @Test
    void shouldThrowExceptionWhenEndDateBeforeStartDate() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 12, 1);
        LocalDate endDate = LocalDate.of(2024, 11, 1);
        
        // When/Then
        assertThatThrownBy(() -> validationService.validateDateRange(startDate, endDate))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("End date must be after start date");
    }

    @Test
    void shouldThrowExceptionWhenEndDateEqualsStartDate() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 12, 1);
        LocalDate endDate = LocalDate.of(2024, 12, 1);
        
        // When/Then
        assertThatThrownBy(() -> validationService.validateDateRange(startDate, endDate))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("End date must be after start date");
    }

    @Test
    void shouldThrowExceptionWhenRateLimitExceeded() {
        // Given
        String email = "test@example.com";
        String message = "Test message";
        String website = "";
        String ipAddress = "127.0.0.1";
        
        when(contactRepository.countByIpAddressAndCreatedAtAfter(any(), any()))
            .thenReturn(3L); // MAX_SUBMISSIONS_PER_HOUR exceeded
        
        // When/Then
        assertThatThrownBy(() -> 
            validationService.validateContactSubmission(email, message, website, ipAddress))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Too many submissions");
    }

    @Test
    void shouldThrowExceptionWhenHoneypotFilled() {
        // Given
        String email = "spam@example.com";
        String message = "Spam message";
        String website = "http://spam.com"; // Honeypot filled
        String ipAddress = "127.0.0.1";
        
        // When/Then - Honeypot check happens before rate limit check
        assertThatThrownBy(() -> 
            validationService.validateContactSubmission(email, message, website, ipAddress))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Invalid submission detected");
    }

    @Test
    void shouldThrowExceptionWhenDuplicateResourceExists() {
        // Given
        String resourceName = "Project";
        String fieldName = "title";
        String fieldValue = "Existing Title";
        boolean exists = true;
        
        // When/Then
        assertThatThrownBy(() -> 
            validationService.validateResourceNotExists(resourceName, fieldName, fieldValue, exists))
            .isInstanceOf(DuplicateResourceException.class);
    }
}

