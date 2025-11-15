package com.mytechfolio.portfolio.service;

/**
 * Base service interface for common CRUD operations.
 * Promotes code reusability and consistency.
 * 
 * @param <T> Entity type
 * @param <ID> ID type
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 */
public interface BaseService<T, ID, R, C, U> {
    
    /**
     * Get all entities with pagination.
     */
    com.mytechfolio.portfolio.dto.response.PageResponse<R> findAll(int page, int size, String sort);
    
    /**
     * Get entity by ID.
     */
    R findById(ID id);
    
    /**
     * Create new entity.
     */
    R create(C createRequest);
    
    /**
     * Update existing entity.
     */
    R update(ID id, U updateRequest);
    
    /**
     * Delete entity by ID.
     */
    void deleteById(ID id);
    
    /**
     * Check if entity exists.
     */
    boolean existsById(ID id);
}

// BaseServiceImpl moved to separate file: BaseServiceImpl.java

