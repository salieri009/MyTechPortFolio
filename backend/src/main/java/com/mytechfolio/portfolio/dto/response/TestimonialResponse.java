package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Testimonial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for testimonial.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialResponse {
    
    private String id;
    private String authorName;
    private String authorTitle;
    private String authorCompany;
    private String authorLinkedInUrl;
    private String content;
    private Integer rating;
    private String type; // CLIENT, COLLEAGUE, MENTOR, PROFESSOR, OTHER
    private String source; // LINKEDIN, EMAIL, MANUAL, OTHER
    private Boolean isFeatured;
    private Integer displayOrder;
    private String projectId;
    private LocalDateTime testimonialDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

