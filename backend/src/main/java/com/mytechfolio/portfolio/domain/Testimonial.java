package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Testimonial entity.
 * Stores recommendations and testimonials from clients, colleagues, or mentors.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "testimonials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Testimonial {
    
    @Id
    private String id;
    
    private String authorName; // Name of the person giving testimonial
    private String authorTitle; // Job title or role
    private String authorCompany; // Company name
    private String authorEmail; // Optional email
    private String authorLinkedInUrl; // Optional LinkedIn profile
    
    private String content; // Testimonial content
    private Integer rating; // Rating out of 5 (1-5)
    
    private TestimonialType type; // CLIENT, COLLEAGUE, MENTOR, PROFESSOR, OTHER
    private TestimonialSource source; // LINKEDIN, EMAIL, MANUAL, OTHER
    
    // LinkedIn specific fields
    private String linkedInRecommendationId; // If imported from LinkedIn
    private String linkedInProfileUrl;
    
    // Display settings
    @Builder.Default
    private Boolean isActive = true; // Show on portfolio
    @Builder.Default
    private Boolean isFeatured = false; // Featured testimonial
    private Integer displayOrder; // Order in display
    
    // Moderation
    @Builder.Default
    private Boolean isApproved = true; // Approved for display
    private String internalNotes; // Internal notes for moderation
    
    // Metadata
    private String projectId; // Related project (optional)
    private LocalDateTime testimonialDate; // When testimonial was given
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum TestimonialType {
        CLIENT,      // From clients
        COLLEAGUE,   // From colleagues
        MENTOR,      // From mentors
        PROFESSOR,   // From professors/teachers
        OTHER        // Other sources
    }
    
    public enum TestimonialSource {
        LINKEDIN,    // Imported from LinkedIn
        EMAIL,       // Received via email
        MANUAL,      // Manually entered
        OTHER        // Other sources
    }
}

