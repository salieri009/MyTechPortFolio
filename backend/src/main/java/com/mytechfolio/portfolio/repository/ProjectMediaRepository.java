package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.ProjectMedia;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProjectMedia entity.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface ProjectMediaRepository extends MongoRepository<ProjectMedia, String> {
    
    /**
     * Finds all media for a project, ordered by display order.
     */
    List<ProjectMedia> findByProjectIdOrderByDisplayOrderAsc(String projectId);
    
    /**
     * Finds active media for a project.
     */
    List<ProjectMedia> findByProjectIdAndIsActiveTrueOrderByDisplayOrderAsc(String projectId);
    
    /**
     * Finds primary/featured media for a project.
     */
    Optional<ProjectMedia> findByProjectIdAndIsPrimaryTrue(String projectId);
    
    /**
     * Finds media by type for a project.
     */
    List<ProjectMedia> findByProjectIdAndTypeOrderByDisplayOrderAsc(String projectId, ProjectMedia.MediaType type);
    
    /**
     * Counts media for a project.
     */
    long countByProjectId(String projectId);
    
    /**
     * Deletes all media for a project.
     */
    void deleteByProjectId(String projectId);
}

