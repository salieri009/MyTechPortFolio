package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.TechStack;
import com.mytechfolio.portfolio.dto.request.TechStackCreateRequest;
import com.mytechfolio.portfolio.dto.response.TechStackResponse;
import com.mytechfolio.portfolio.exception.DuplicateResourceException;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.mapper.TechStackMapper;
import com.mytechfolio.portfolio.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing technology stack information.
 * Handles CRUD operations and filtering for tech stacks.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechStackService {

    private final TechStackRepository techStackRepository;
    private final TechStackMapper techStackMapper;

    /**
     * Retrieves all tech stacks, optionally filtered by type.
     * Results are cached for performance.
     * 
     * @param type Optional tech stack type filter
     * @return List of tech stack responses
     */
    @Cacheable(value = "techStacks", key = "#type != null ? #type : 'all'")
    public List<TechStackResponse> getTechStacks(String type) {
        log.debug("Fetching tech stacks with type filter: {}", type);
        
        List<TechStack> techStacks;
        
        if (type != null && !type.isEmpty()) {
            try {
                TechStack.TechType techType = TechStack.TechType.valueOf(type.toUpperCase());
                techStacks = techStackRepository.findByType(techType);
                log.debug("Found {} tech stacks of type: {}", techStacks.size(), type);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid tech stack type: {}", type);
                techStacks = List.of();
            }
        } else {
            techStacks = techStackRepository.findAll();
            log.debug("Found {} total tech stacks", techStacks.size());
        }

        return techStackMapper.toResponseList(techStacks);
    }
    
    /**
     * Creates a new tech stack.
     * 
     * @param request Tech stack creation request
     * @return Created tech stack response
     * @throws DuplicateResourceException if tech stack with same name already exists
     */
    @CacheEvict(value = "techStacks", allEntries = true)
    @Transactional
    public TechStackResponse createTechStack(TechStackCreateRequest request) {
        log.info("Creating new tech stack: {}", request.getName());
        
        // Check if tech stack already exists (validation handled by service for now)
        if (techStackRepository.findByName(request.getName()).isPresent()) {
            log.warn("Tech stack already exists: {}", request.getName());
            throw new DuplicateResourceException("TechStack", "name", request.getName());
        }
        
        TechStack techStack = techStackMapper.toEntity(request);
        TechStack savedTechStack = techStackRepository.save(techStack);
        log.info("Tech stack created successfully with ID: {}", savedTechStack.getId());
        return techStackMapper.toResponse(savedTechStack);
    }
    
    /**
     * Deletes a tech stack by ID.
     * 
     * @param id Tech stack ID
     * @throws ResourceNotFoundException if tech stack not found
     */
    @CacheEvict(value = "techStacks", allEntries = true)
    @Transactional
    public void deleteTechStack(String id) {
        log.info("Deleting tech stack with ID: {}", id);
        if (!techStackRepository.existsById(id)) {
            log.warn("Tech stack not found for deletion with ID: {}", id);
            throw new ResourceNotFoundException("TechStack", id);
        }
        techStackRepository.deleteById(id);
        log.info("Tech stack deleted successfully with ID: {}", id);
    }
    
    /**
     * Deletes all tech stacks.
     * WARNING: This is a destructive operation. Use with caution.
     */
    @CacheEvict(value = "techStacks", allEntries = true)
    @Transactional
    public void deleteAllTechStacks() {
        log.warn("Deleting all tech stacks - this is a destructive operation");
        long count = techStackRepository.count();
        techStackRepository.deleteAll();
        log.info("Deleted {} tech stacks", count);
    }
}
