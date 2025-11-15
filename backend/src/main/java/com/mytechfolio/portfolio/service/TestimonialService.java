package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.Testimonial;
import com.mytechfolio.portfolio.dto.request.TestimonialCreateRequest;
import com.mytechfolio.portfolio.dto.response.TestimonialResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.TestimonialMapper;
import com.mytechfolio.portfolio.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing testimonials.
 * Handles CRUD operations and filtering for testimonials.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TestimonialService {
    
    private final TestimonialRepository testimonialRepository;
    private final TestimonialMapper testimonialMapper;
    
    /**
     * Gets all active and approved testimonials.
     * 
     * @return List of testimonial responses
     */
    public List<TestimonialResponse> getAllTestimonials() {
        log.debug("Fetching all active testimonials");
        List<Testimonial> testimonials = testimonialRepository.findByIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc();
        return testimonials.stream()
                .map(testimonialMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets featured testimonials.
     * 
     * @return List of featured testimonial responses
     */
    public List<TestimonialResponse> getFeaturedTestimonials() {
        log.debug("Fetching featured testimonials");
        List<Testimonial> testimonials = testimonialRepository.findByIsFeaturedTrueAndIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc();
        return testimonials.stream()
                .map(testimonialMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets testimonials by type.
     * 
     * @param type Testimonial type
     * @return List of testimonial responses
     */
    public List<TestimonialResponse> getTestimonialsByType(Testimonial.TestimonialType type) {
        log.debug("Fetching testimonials by type: {}", type);
        List<Testimonial> testimonials = testimonialRepository.findByTypeAndIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc(type);
        return testimonials.stream()
                .map(testimonialMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets testimonials by minimum rating.
     * 
     * @param minRating Minimum rating (1-5)
     * @return List of testimonial responses
     */
    public List<TestimonialResponse> getTestimonialsByRating(Integer minRating) {
        log.debug("Fetching testimonials with rating >= {}", minRating);
        List<Testimonial> testimonials = testimonialRepository.findByRatingGreaterThanEqualAndIsActiveTrueAndIsApprovedTrue(minRating);
        return testimonials.stream()
                .map(testimonialMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets a testimonial by ID.
     * 
     * @param id Testimonial ID
     * @return Testimonial response
     * @throws ResourceNotFoundException if not found
     */
    public TestimonialResponse getTestimonial(String id) {
        log.debug("Fetching testimonial with ID: {}", id);
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id));
        return testimonialMapper.toResponse(testimonial);
    }
    
    /**
     * Creates a new testimonial.
     * 
     * @param request Testimonial creation request
     * @return Created testimonial response
     */
    @Transactional
    public TestimonialResponse createTestimonial(TestimonialCreateRequest request) {
        log.info("Creating new testimonial from: {}", request.getAuthorName());
        
        // Set display order if not provided
        if (request.getDisplayOrder() == null) {
            long count = testimonialRepository.countByIsActiveTrueAndIsApprovedTrue();
            request.setDisplayOrder((int) count);
        }
        
        Testimonial testimonial = testimonialMapper.toEntity(request);
        Testimonial saved = testimonialRepository.save(testimonial);
        log.info("Testimonial created successfully with ID: {}", saved.getId());
        return testimonialMapper.toResponse(saved);
    }
    
    /**
     * Updates a testimonial.
     * 
     * @param id Testimonial ID
     * @param request Update request
     * @return Updated testimonial response
     * @throws ResourceNotFoundException if not found
     */
    @Transactional
    public TestimonialResponse updateTestimonial(String id, TestimonialCreateRequest request) {
        log.info("Updating testimonial with ID: {}", id);
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id));
        
        testimonialMapper.updateEntity(testimonial, request);
        Testimonial updated = testimonialRepository.save(testimonial);
        log.info("Testimonial updated successfully with ID: {}", id);
        return testimonialMapper.toResponse(updated);
    }
    
    /**
     * Deletes a testimonial.
     * 
     * @param id Testimonial ID
     * @throws ResourceNotFoundException if not found
     */
    @Transactional
    public void deleteTestimonial(String id) {
        log.info("Deleting testimonial with ID: {}", id);
        if (!testimonialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial", id);
        }
        testimonialRepository.deleteById(id);
        log.info("Testimonial deleted successfully with ID: {}", id);
    }
}

