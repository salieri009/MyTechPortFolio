package com.mytechfolio.portfolio.util;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Utility class for pagination and sorting operations.
 * Reusable across all services.
 */
public class PaginationUtil {
    
    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;
    private static final String DEFAULT_SORT_FIELD = "createdAt";
    private static final Sort.Direction DEFAULT_SORT_DIRECTION = Sort.Direction.DESC;
    
    /**
     * Creates a Pageable object with validation.
     * Security: Prevents DoS attacks by limiting page size.
     */
    public static Pageable createPageable(int page, int size, Sort sort) {
        // Validate and normalize page (1-based to 0-based)
        int normalizedPage = Math.max(1, page) - 1;
        
        // Validate and limit size to prevent DoS
        int normalizedSize = Math.min(Math.max(1, size), MAX_SIZE);
        
        if (sort == null) {
            sort = Sort.by(DEFAULT_SORT_DIRECTION, DEFAULT_SORT_FIELD);
        }
        
        return PageRequest.of(normalizedPage, normalizedSize, sort);
    }
    
    /**
     * Creates a Pageable with default sorting.
     */
    public static Pageable createPageable(int page, int size) {
        return createPageable(page, size, null);
    }
    
    /**
     * Creates a Pageable with default values.
     */
    public static Pageable createDefaultPageable() {
        return createPageable(DEFAULT_PAGE, DEFAULT_SIZE);
    }
    
    /**
     * Parses sort string (format: "field,direction").
     * Example: "endDate,desc" or "name,asc"
     */
    public static Sort parseSort(String sortString, String defaultField, Sort.Direction defaultDirection) {
        if (sortString == null || sortString.trim().isEmpty()) {
            return Sort.by(defaultDirection, defaultField);
        }
        
        String[] parts = sortString.split(",");
        if (parts.length != 2) {
            return Sort.by(defaultDirection, defaultField);
        }
        
        String field = parts[0].trim();
        String direction = parts[1].trim().toLowerCase();
        
        Sort.Direction sortDirection = direction.equals("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        // Security: Validate field name to prevent injection
        if (!isValidFieldName(field)) {
            return Sort.by(defaultDirection, defaultField);
        }
        
        return Sort.by(sortDirection, field);
    }
    
    /**
     * Parses sort string with default field and direction.
     */
    public static Sort parseSort(String sortString) {
        return parseSort(sortString, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION);
    }
    
    /**
     * Validates field name to prevent injection attacks.
     */
    private static boolean isValidFieldName(String field) {
        // Only allow alphanumeric, underscore, and dot characters
        return field != null && field.matches("^[a-zA-Z0-9_.]+$");
    }
    
    /**
     * Converts Spring Data Page to PageResponse.
     */
    public static <T, R> com.mytechfolio.portfolio.dto.response.PageResponse<R> toPageResponse(
            Page<T> page, 
            java.util.function.Function<T, R> mapper,
            int originalPage) {
        return com.mytechfolio.portfolio.dto.response.PageResponse.<R>builder()
                .page(originalPage)
                .size(page.getSize())
                .total(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .items(page.getContent().stream()
                        .map(mapper)
                        .collect(java.util.stream.Collectors.toList()))
                .build();
    }
}

