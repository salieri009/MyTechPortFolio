package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    
    List<Project> findByFeaturedTrue();
    
    List<Project> findByCategory(String category);
    
    List<Project> findByStatus(Project.ProjectStatus status);
    
    @Query("{ 'techStack': { $in: ?0 } }")
    List<Project> findByTechStackIn(List<String> techStack);
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    List<Project> findByTitleContainingIgnoreCase(String title);
    
    @Query("{ 'description': { $regex: ?0, $options: 'i' } }")
    List<Project> findByDescriptionContainingIgnoreCase(String description);
    
    Optional<Project> findByGithubUrl(String githubUrl);
    
    List<Project> findAllByOrderByStartDateDesc();
    
    @Query("{ $and: [ " +
           "{ $or: [ { ?0: null }, { 'techStack': { $in: ?0 } } ] }, " +
           "{ $or: [ { ?1: null }, { $expr: { $eq: [ { $year: '$startDate' }, ?1 ] } } ] } " +
           "] }")
    Page<Project> findProjectsWithFilters(List<String> techStacks, Integer year, Pageable pageable);
}
