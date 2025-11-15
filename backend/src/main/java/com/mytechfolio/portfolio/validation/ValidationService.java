package com.mytechfolio.portfolio.validation;

import com.mytechfolio.portfolio.exception.DuplicateResourceException;
import com.mytechfolio.portfolio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Centralized validation service for business rules.
 * Separates validation concerns from service logic.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ValidationService {
    
    private final ContactRepository contactRepository;
    private static final int MAX_SUBMISSIONS_PER_HOUR = 3;
    private static final int MIN_TIME_BETWEEN_SUBMISSIONS_SECONDS = 60;
    
    /**
     * Validates contact form submission for spam and rate limiting.
     * 
     * @param email Contact email
     * @param message Contact message
     * @param website Honeypot field (should be empty)
     * @param ipAddress Client IP address
     * @throws IllegalArgumentException if validation fails
     */
    public void validateContactSubmission(String email, String message, String website, String ipAddress) {
        // Spam protection: Check honeypot field
        if (website != null && !website.isEmpty()) {
            log.warn("Spam detected: Honeypot field filled for email: {}", email);
            throw new IllegalArgumentException("Invalid submission detected");
        }
        
        // Rate limiting: Check submissions from same IP
        LocalDateTime oneHourAgo = LocalDateTime.now().minus(1, ChronoUnit.HOURS);
        long recentSubmissions = contactRepository.countByIpAddressAndCreatedAtAfter(
            hashIpAddress(ipAddress), oneHourAgo);
        
        if (recentSubmissions >= MAX_SUBMISSIONS_PER_HOUR) {
            log.warn("Rate limit exceeded for IP: {}", ipAddress);
            throw new IllegalArgumentException("Too many submissions. Please try again later.");
        }
        
        // Check for duplicate recent submission (same email, same message)
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minus(MIN_TIME_BETWEEN_SUBMISSIONS_SECONDS, ChronoUnit.SECONDS);
        boolean recentDuplicate = contactRepository.existsByEmailAndMessageAndCreatedAtAfter(
            email, 
            message, 
            oneMinuteAgo);
        
        if (recentDuplicate) {
            log.warn("Duplicate submission detected for email: {}", email);
            throw new DuplicateResourceException("Contact", "email", email);
        }
    }
    
    /**
     * Validates that a resource doesn't already exist.
     * 
     * @param resourceName Resource name for error messages
     * @param fieldName Field name being checked
     * @param fieldValue Field value being checked
     * @param exists Whether the resource already exists
     * @throws DuplicateResourceException if resource exists
     */
    public void validateResourceNotExists(String resourceName, String fieldName, String fieldValue, boolean exists) {
        if (exists) {
            log.warn("Duplicate resource detected: {} with {} = {}", resourceName, fieldName, fieldValue);
            throw new DuplicateResourceException(resourceName, fieldName, fieldValue);
        }
    }
    
    /**
     * Validates date range.
     * 
     * @param startDate Start date
     * @param endDate End date
     * @throws IllegalArgumentException if date range is invalid
     */
    public void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }
    
    /**
     * Validates date range using LocalDate.
     * 
     * @param startDate Start date
     * @param endDate End date
     * @throws IllegalArgumentException if date range is invalid
     */
    public void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate != null && endDate != null && (endDate.isBefore(startDate) || endDate.isEqual(startDate))) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }
    
    /**
     * Hashes IP address for privacy.
     * In production, use proper hashing algorithm.
     */
    private String hashIpAddress(String ipAddress) {
        // Simple hash for now - in production use SHA-256 or similar
        return String.valueOf(ipAddress.hashCode());
    }
}

