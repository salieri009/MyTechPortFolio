package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    // Find featured projects
    Page<Project> findByIsFeaturedTrue(Pageable pageable);
    
    // Find by status
    Page<Project> findByStatus(Project.ProjectStatus status, Pageable pageable);
    
    // Find by tech stack IDs (projects that use specific technologies)
    @Query("{'techStackIds': {$in: ?0}}")
    Page<Project> findByTechStackIds(List<String> techStackIds, Pageable pageable);
    
    // Find by date range
    @Query("{'startDate': {$gte: ?0, $lte: ?1}}")
    Page<Project> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    // Find by year
    @Query("{'startDate': {$gte: ?0, $lt: ?1}}")
    Page<Project> findByYear(LocalDate yearStart, LocalDate yearEnd, Pageable pageable);
    
    // Search by title or summary
    @Query("{'$or': [{'title': {$regex: ?0, $options: 'i'}}, {'summary': {$regex: ?0, $options: 'i'}}]}")
    Page<Project> findByTitleOrSummaryContainingIgnoreCase(String searchTerm, Pageable pageable);
    
    // Find by repository name
    Optional<Project> findByRepositoryName(String repositoryName);
    
    // Find projects with GitHub URL
    @Query("{'githubUrl': {$ne: null, $ne: ''}}")
    List<Project> findProjectsWithGithubUrl();
    
    // Find projects with demo URL
    @Query("{'demoUrl': {$ne: null, $ne: ''}}")
    List<Project> findProjectsWithDemoUrl();
    
    // Find most viewed projects
    @Query(value = "{}", sort = "{'viewCount': -1}")
    Page<Project> findMostViewedProjects(Pageable pageable);
    
    // Find recent projects
    @Query(value = "{}", sort = "{'createdAt': -1}")
    Page<Project> findRecentProjects(Pageable pageable);
    
    // Find by related academic IDs
    @Query("{'relatedAcademicIds': {$in: ?0}}")
    List<Project> findByRelatedAcademicIds(List<String> academicIds);
    
    // Count by status
    long countByStatus(Project.ProjectStatus status);
    
    // Increment view count
    @Query("{'_id': ?0}")
    Optional<Project> findByIdForViewCount(String id);
    
    // Find projects with filters (compatibility method)
    default Page<Project> findProjectsWithFilters(List<String> techStackIds, Integer year, Pageable pageable) {
        if (year != null) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            LocalDate yearEnd = LocalDate.of(year, 12, 31);
            return findByYear(yearStart, yearEnd, pageable);
        }
        if (techStackIds != null && !techStackIds.isEmpty()) {
            return findByTechStackIds(techStackIds, pageable);
        }
        return findAll(pageable);
    }
    
    // Find by ID with details (compatibility method - just use findById)
    default Optional<Project> findByIdWithDetails(String id) {
        return findById(id);
    }
}
