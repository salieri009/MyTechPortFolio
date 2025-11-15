package com.mytechfolio.portfolio.controller.base;

import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import org.springframework.http.ResponseEntity;

/**
 * Base controller interface for common CRUD operations.
 * Defines standard REST endpoints following RESTful conventions.
 * 
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 * @param <ID> ID type
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public interface BaseController<R, C, U, ID> {
    
    /**
     * Get paginated list of resources.
     * 
     * @param page Page number (1-based)
     * @param size Page size
     * @param sort Sort criteria (field,direction)
     * @return Paginated response
     */
    ResponseEntity<ApiResponse<PageResponse<R>>> findAll(int page, int size, String sort);
    
    /**
     * Get resource by ID.
     * 
     * @param id Resource ID
     * @return Resource response
     */
    ResponseEntity<ApiResponse<R>> findById(ID id);
    
    /**
     * Create new resource.
     * 
     * @param createRequest Create request DTO
     * @return Created resource response
     */
    ResponseEntity<ApiResponse<R>> create(C createRequest);
    
    /**
     * Update existing resource.
     * 
     * @param id Resource ID
     * @param updateRequest Update request DTO
     * @return Updated resource response
     */
    ResponseEntity<ApiResponse<R>> update(ID id, U updateRequest);
    
    /**
     * Delete resource by ID.
     * 
     * @param id Resource ID
     * @return No content response
     */
    ResponseEntity<ApiResponse<Void>> delete(ID id);
}

