package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.domain.Testimonial;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a testimonial.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialCreateRequest {
    
    @NotBlank(message = "Author name is required")
    @Size(min = 2, max = 100, message = "Author name must be between 2 and 100 characters")
    private String authorName;
    
    @Size(max = 100, message = "Author title must not exceed 100 characters")
    private String authorTitle;
    
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    private String authorCompany;
    
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String authorEmail;
    
    @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
    private String authorLinkedInUrl;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 2000, message = "Content must be between 10 and 2000 characters")
    private String content;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    @NotNull(message = "Type is required")
    private Testimonial.TestimonialType type;
    
    @Builder.Default
    private Testimonial.TestimonialSource source = Testimonial.TestimonialSource.MANUAL;
    
    @Builder.Default
    private Boolean isFeatured = false;
    
    private Integer displayOrder;
    
    private String projectId; // Optional: related project
}

