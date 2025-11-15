package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for resume/CV management.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {
    
    /**
     * Finds all active resumes.
     */
    List<Resume> findByIsActiveTrue();
    
    /**
     * Finds active and public resumes.
     */
    List<Resume> findByIsActiveTrueAndIsPublicTrue();
    
    /**
     * Finds resume by version.
     */
    Optional<Resume> findByVersion(String version);
    
    /**
     * Finds resume by version and active status.
     */
    Optional<Resume> findByVersionAndIsActiveTrue(String version);
}

