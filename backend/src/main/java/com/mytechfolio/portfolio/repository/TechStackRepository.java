package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.TechStack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechStackRepository extends MongoRepository<TechStack, String> {
    
    // Find by type
    List<TechStack> findByType(TechStack.TechType type);
    
    // Find by type with pagination
    Page<TechStack> findByType(TechStack.TechType type, Pageable pageable);
    
    // Find by name (case insensitive)
    Optional<TechStack> findByNameIgnoreCase(String name);
    
    // Search by name containing
    List<TechStack> findByNameContainingIgnoreCase(String name);
    
    // Find all ordered by name
    List<TechStack> findAllByOrderByNameAsc();
    
    // Find all ordered by type and name
    List<TechStack> findAllByOrderByTypeAscNameAsc();
    
    // Find by category
    @Query("{'category': ?0}")
    List<TechStack> findByCategory(String category);
    
    // Find popular tech stacks (those used in many projects)
    @Query(value = "{}", sort = "{'usageCount': -1}")
    List<TechStack> findPopularTechStacks();
    
    // Find frontend technologies
    @Query("{'type': 'FRONTEND'}")
    List<TechStack> findFrontendTechnologies();
    
    // Find backend technologies
    @Query("{'type': 'BACKEND'}")
    List<TechStack> findBackendTechnologies();
    
    // Find database technologies
    @Query("{'type': 'DATABASE'}")
    List<TechStack> findDatabaseTechnologies();
    
    // Find tools
    @Query("{'type': 'TOOL'}")
    List<TechStack> findTools();
    
    // Check if tech stack exists by name
    boolean existsByNameIgnoreCase(String name);
    
    // Count by type
    long countByType(TechStack.TechType type);
    
    // Find tech stacks with description containing keyword
    @Query("{'description': {$regex: ?0, $options: 'i'}}")
    List<TechStack> findByDescriptionContaining(String keyword);
    
    // Find by name (compatibility method)
    default Optional<TechStack> findByName(String name) {
        return findByNameIgnoreCase(name);
    }
    
    // Find by ID list (compatibility method)
    default List<TechStack> findByIdIn(List<String> ids) {
        return (List<TechStack>) findAllById(ids);
    }
}
