package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Contact;
import com.mytechfolio.portfolio.dto.request.ContactRequest;
import com.mytechfolio.portfolio.repository.ContactRepository;
import com.mytechfolio.portfolio.util.InputSanitizer;
import com.mytechfolio.portfolio.validation.ValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling contact form submissions.
 * Includes spam protection and lead management.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContactService {
    
    private final ContactRepository contactRepository;
    private final InputSanitizer inputSanitizer;
    private final ValidationService validationService;
    private final EmailService emailService;
    
    /**
     * Submits a contact form.
     * Includes spam protection and rate limiting.
     * 
     * @param request Contact form request
     * @param ipAddress Client IP address
     * @param userAgent Client user agent
     * @return Created contact entity
     */
    public Contact submitContact(ContactRequest request, String ipAddress, String userAgent) {
        log.info("Contact form submission from: {} ({})", request.getEmail(), request.getName());
        
        // Centralized validation
        try {
            validationService.validateContactSubmission(
                request.getEmail(), 
                request.getMessage(), 
                request.getWebsite(), 
                ipAddress
            );
        } catch (IllegalArgumentException e) {
            // Spam detected - create spam contact
            if (request.getWebsite() != null && !request.getWebsite().isEmpty()) {
                Contact spamContact = createSpamContact(request, ipAddress, userAgent);
                return contactRepository.save(spamContact);
            }
            throw e;
        }
        
        // Sanitize input
        String sanitizedMessage = inputSanitizer.sanitizeText(request.getMessage());
        String sanitizedName = inputSanitizer.sanitizeText(request.getName());
        
        // Create contact entity
        Contact contact = Contact.builder()
                .email(request.getEmail())
                .name(sanitizedName)
                .company(inputSanitizer.sanitizeText(request.getCompany()))
                .subject(inputSanitizer.sanitizeText(request.getSubject()))
                .message(sanitizedMessage)
                .phoneNumber(request.getPhoneNumber())
                .linkedInUrl(request.getLinkedInUrl())
                .jobTitle(inputSanitizer.sanitizeText(request.getJobTitle()))
                .referrer(request.getReferrer())
                .source(request.getSource())
                .projectId(request.getProjectId())
                .ipAddress(String.valueOf(ipAddress.hashCode()))
                .userAgent(userAgent)
                .status(Contact.ContactStatus.NEW)
                .isSpam(false)
                .isRead(false)
                .isReplied(false)
                .build();
        
        Contact savedContact = contactRepository.save(contact);
        log.info("Contact saved successfully with ID: {}", savedContact.getId());
        
        // Send email notifications asynchronously
        try {
            emailService.sendContactNotification(
                savedContact.getName(),
                savedContact.getEmail(),
                savedContact.getMessage(),
                savedContact.getCompany(),
                savedContact.getJobTitle()
            );
            emailService.sendContactAutoResponder(savedContact.getEmail(), savedContact.getName());
        } catch (Exception e) {
            log.error("Failed to send email notifications: {}", e.getMessage(), e);
            // Don't fail the contact submission if email fails
        }
        
        return savedContact;
    }
    
    /**
     * Creates a spam contact entry for tracking.
     */
    private Contact createSpamContact(ContactRequest request, String ipAddress, String userAgent) {
        return Contact.builder()
                .email(request.getEmail())
                .name(inputSanitizer.sanitizeText(request.getName()))
                .message(inputSanitizer.sanitizeText(request.getMessage()))
                .ipAddress(String.valueOf(ipAddress.hashCode()))
                .userAgent(userAgent)
                .status(Contact.ContactStatus.SPAM)
                .isSpam(true)
                .build();
    }
    
}

