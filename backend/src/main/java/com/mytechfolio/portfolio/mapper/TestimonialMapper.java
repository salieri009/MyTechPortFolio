package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.Testimonial;
import com.mytechfolio.portfolio.dto.request.TestimonialCreateRequest;
import com.mytechfolio.portfolio.dto.response.TestimonialResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper for Testimonial entity conversions.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class TestimonialMapper extends EntityMapper<Testimonial, TestimonialResponse, TestimonialCreateRequest, TestimonialCreateRequest> {
    
    @Override
    public TestimonialResponse toResponse(Testimonial testimonial) {
        if (testimonial == null) {
            return null;
        }
        
        return TestimonialResponse.builder()
                .id(testimonial.getId())
                .authorName(testimonial.getAuthorName())
                .authorTitle(testimonial.getAuthorTitle())
                .authorCompany(testimonial.getAuthorCompany())
                .authorLinkedInUrl(testimonial.getAuthorLinkedInUrl())
                .content(testimonial.getContent())
                .rating(testimonial.getRating())
                .type(testimonial.getType() != null ? testimonial.getType().name() : null)
                .source(testimonial.getSource() != null ? testimonial.getSource().name() : null)
                .isFeatured(testimonial.getIsFeatured())
                .displayOrder(testimonial.getDisplayOrder())
                .projectId(testimonial.getProjectId())
                .testimonialDate(testimonial.getTestimonialDate())
                .createdAt(testimonial.getCreatedAt())
                .updatedAt(testimonial.getUpdatedAt())
                .build();
    }
    
    @Override
    public Testimonial toEntity(TestimonialCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }
        
        return Testimonial.builder()
                .authorName(createRequest.getAuthorName())
                .authorTitle(createRequest.getAuthorTitle())
                .authorCompany(createRequest.getAuthorCompany())
                .authorEmail(createRequest.getAuthorEmail())
                .authorLinkedInUrl(createRequest.getAuthorLinkedInUrl())
                .content(createRequest.getContent())
                .rating(createRequest.getRating())
                .type(createRequest.getType())
                .source(createRequest.getSource())
                .isFeatured(createRequest.getIsFeatured())
                .displayOrder(createRequest.getDisplayOrder())
                .projectId(createRequest.getProjectId())
                .testimonialDate(java.time.LocalDateTime.now())
                .isActive(true)
                .isApproved(true)
                .build();
    }
    
    @Override
    public void updateEntity(Testimonial entity, TestimonialCreateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }
        
        if (updateRequest.getAuthorName() != null) {
            entity.setAuthorName(updateRequest.getAuthorName());
        }
        if (updateRequest.getAuthorTitle() != null) {
            entity.setAuthorTitle(updateRequest.getAuthorTitle());
        }
        if (updateRequest.getAuthorCompany() != null) {
            entity.setAuthorCompany(updateRequest.getAuthorCompany());
        }
        if (updateRequest.getAuthorLinkedInUrl() != null) {
            entity.setAuthorLinkedInUrl(updateRequest.getAuthorLinkedInUrl());
        }
        if (updateRequest.getContent() != null) {
            entity.setContent(updateRequest.getContent());
        }
        if (updateRequest.getRating() != null) {
            entity.setRating(updateRequest.getRating());
        }
        if (updateRequest.getType() != null) {
            entity.setType(updateRequest.getType());
        }
        if (updateRequest.getIsFeatured() != null) {
            entity.setIsFeatured(updateRequest.getIsFeatured());
        }
        if (updateRequest.getDisplayOrder() != null) {
            entity.setDisplayOrder(updateRequest.getDisplayOrder());
        }
        if (updateRequest.getProjectId() != null) {
            entity.setProjectId(updateRequest.getProjectId());
        }
    }
}

