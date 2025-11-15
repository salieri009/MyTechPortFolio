package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Testimonial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Testimonial entity.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface TestimonialRepository extends MongoRepository<Testimonial, String> {
    
    /**
     * Finds all active and approved testimonials, ordered by display order.
     */
    List<Testimonial> findByIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc();
    
    /**
     * Finds featured testimonials.
     */
    List<Testimonial> findByIsFeaturedTrueAndIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc();
    
    /**
     * Finds testimonials by type.
     */
    List<Testimonial> findByTypeAndIsActiveTrueAndIsApprovedTrueOrderByDisplayOrderAsc(Testimonial.TestimonialType type);
    
    /**
     * Finds testimonials by source.
     */
    List<Testimonial> findBySource(Testimonial.TestimonialSource source);
    
    /**
     * Finds testimonials by rating (minimum rating).
     */
    List<Testimonial> findByRatingGreaterThanEqualAndIsActiveTrueAndIsApprovedTrue(Integer minRating);
    
    /**
     * Finds testimonials related to a project.
     */
    List<Testimonial> findByProjectIdAndIsActiveTrueAndIsApprovedTrue(String projectId);
    
    /**
     * Finds testimonial by LinkedIn recommendation ID.
     */
    Optional<Testimonial> findByLinkedInRecommendationId(String linkedInRecommendationId);
    
    /**
     * Counts active testimonials.
     */
    long countByIsActiveTrueAndIsApprovedTrue();
}

