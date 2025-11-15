package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Contact form request DTO.
 * Used for lead generation and recruiter inquiries.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
public class ContactRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    private String company;
    
    @Size(max = 100, message = "Subject must not exceed 100 characters")
    private String subject;
    
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;
    
    // Optional fields for better lead qualification
    private String phoneNumber;
    
    private String linkedInUrl;
    
    private String jobTitle;
    
    // Honeypot field for spam protection
    private String website; // Should be empty for legitimate submissions
    
    // Tracking fields
    private String referrer;
    private String source; // "portfolio", "project", "resume", etc.
    private String projectId; // If contacting about specific project
}

