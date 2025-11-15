package com.mytechfolio.portfolio.mapper;

import org.springframework.stereotype.Component;

/**
 * Abstract base mapper implementation.
 * Provides common mapping utilities and patterns.
 * 
 * @param <E> Entity type
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public abstract class EntityMapper<E, R, C, U> implements Mapper<E, R, C, U> {
    
    /**
     * Converts a list of entities to response DTOs.
     * 
     * @param entities List of entities
     * @return List of response DTOs
     */
    public java.util.List<R> toResponseList(java.util.List<E> entities) {
        if (entities == null) {
            return java.util.Collections.emptyList();
        }
        return entities.stream()
                .map(this::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Safely converts entity to response, returning null if entity is null.
     * 
     * @param entity Entity to convert
     * @return Response DTO or null
     */
    public R toResponseSafe(E entity) {
        return entity == null ? null : toResponse(entity);
    }
}

