package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Journey Milestone entities.
 * Provides data access operations for journey milestones.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface JourneyMilestoneRepository extends MongoRepository<JourneyMilestone, String> {

    /**
     * Find all milestones ordered by year ascending.
     * 
     * @return List of milestones ordered by year
     */
    List<JourneyMilestone> findAllByOrderByYearAsc();

    /**
     * Find milestones by status.
     * 
     * @param status Milestone status
     * @return List of milestones with the specified status
     */
    List<JourneyMilestone> findByStatus(JourneyMilestone.MilestoneStatus status);

    /**
     * Find milestone by year.
     * 
     * @param year Year string
     * @return Optional milestone
     */
    Optional<JourneyMilestone> findByYear(String year);

    /**
     * Check if milestone exists by year.
     * 
     * @param year Year string
     * @return true if exists
     */
    boolean existsByYear(String year);
}

