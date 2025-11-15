package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.constants.ApiConstants;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import com.mytechfolio.portfolio.exception.ResourceNotFoundException;
import com.mytechfolio.portfolio.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Abstract base service implementation with common CRUD operations.
 * Reduces code duplication across services.
 * 
 * @param <T> Entity type
 * @param <ID> ID type
 * @param <R> Response DTO type
 * @param <C> Create Request DTO type
 * @param <U> Update Request DTO type
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public abstract class BaseServiceImpl<T, ID, R, C, U> implements BaseService<T, ID, R, C, U> {
    
    protected final MongoRepository<T, ID> repository;
    
    protected BaseServiceImpl(MongoRepository<T, ID> repository) {
        this.repository = repository;
    }
    
    /**
     * Convert entity to response DTO.
     */
    protected abstract R toResponse(T entity);
    
    /**
     * Convert create request to entity.
     */
    protected abstract T toEntity(C createRequest);
    
    /**
     * Update entity from update request.
     */
    protected abstract void updateEntity(T entity, U updateRequest);
    
    /**
     * Get resource name for error messages.
     */
    protected abstract String getResourceName();
    
    /**
     * Get default sort field for pagination.
     * Override in subclasses to customize default sorting.
     */
    protected String getDefaultSortField() {
        return ApiConstants.DEFAULT_SORT_FIELD;
    }
    
    /**
     * Get default sort direction for pagination.
     * Override in subclasses to customize default sort direction.
     */
    protected Sort.Direction getDefaultSortDirection() {
        return Sort.Direction.valueOf(ApiConstants.DEFAULT_SORT_DIRECTION);
    }
    
    @Override
    public PageResponse<R> findAll(int page, int size, String sort) {
        Sort sortBy = PaginationUtil.parseSort(sort, getDefaultSortField(), getDefaultSortDirection());
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy);
        Page<T> entityPage = repository.findAll(pageable);
        return PaginationUtil.toPageResponse(entityPage, this::toResponse, page);
    }
    
    @Override
    public R findById(ID id) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(getResourceName(), String.valueOf(id)));
        return toResponse(entity);
    }
    
    @Override
    @Transactional
    public R create(C createRequest) {
        T entity = toEntity(createRequest);
        T savedEntity = repository.save(entity);
        return toResponse(savedEntity);
    }
    
    @Override
    @Transactional
    public R update(ID id, U updateRequest) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(getResourceName(), String.valueOf(id)));
        updateEntity(entity, updateRequest);
        T savedEntity = repository.save(entity);
        return toResponse(savedEntity);
    }
    
    @Override
    @Transactional
    public void deleteById(ID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(getResourceName(), String.valueOf(id));
        }
        repository.deleteById(id);
    }
    
    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }
    
    /**
     * Find all entities (non-paginated).
     * Use findAll(int, int, String) for paginated results.
     */
    public List<R> findAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Count all entities.
     */
    public long count() {
        return repository.count();
    }
}

