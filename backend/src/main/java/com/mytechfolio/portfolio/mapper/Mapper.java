package com.mytechfolio.portfolio.mapper;

/**
 * Generic mapper interface for entity-DTO conversions.
 * Follows DRY principle by centralizing conversion logic.
 * 
 * @param <E> Entity type
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public interface Mapper<E, R, C, U> {
    
    /**
     * Converts entity to response DTO.
     * 
     * @param entity Entity to convert
     * @return Response DTO
     */
    R toResponse(E entity);
    
    /**
     * Converts create request DTO to entity.
     * 
     * @param createRequest Create request DTO
     * @return Entity instance
     */
    E toEntity(C createRequest);
    
    /**
     * Updates entity from update request DTO.
     * 
     * @param entity Existing entity to update
     * @param updateRequest Update request DTO
     */
    void updateEntity(E entity, U updateRequest);
}

