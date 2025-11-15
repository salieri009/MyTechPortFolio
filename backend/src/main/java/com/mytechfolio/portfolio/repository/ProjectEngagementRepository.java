package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.ProjectEngagement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for project engagement tracking.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface ProjectEngagementRepository extends MongoRepository<ProjectEngagement, String> {
    
    /**
     * Finds all engagements for a project.
     */
    List<ProjectEngagement> findByProjectId(String projectId);
    
    /**
     * Finds engagements by session ID.
     */
    List<ProjectEngagement> findBySessionId(String sessionId);
    
    /**
     * Finds high-value engagements (likely recruiters).
     */
    default List<ProjectEngagement> findHighValueEngagements() {
        return findAll().stream()
                .filter(ProjectEngagement::isHighValueEngagement)
                .collect(java.util.stream.Collectors.toList());
    }
}

