package com.mytechfolio.portfolio.util;

import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.function.Function;

/**
 * Utility class for creating standardized API responses.
 * Improves code reusability and consistency across controllers.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public final class ResponseUtil {
    
    private ResponseUtil() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
    
    /**
     * Creates a successful response with data.
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }
    
    /**
     * Creates a successful response with data and message.
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String message) {
        return ResponseEntity.ok(ApiResponse.success(data, message));
    }
    
    /**
     * Creates a created response (201) with data.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data));
    }
    
    /**
     * Creates a created response (201) with data and message.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, message));
    }
    
    /**
     * Creates a no content response (204).
     */
    public static <T> ResponseEntity<ApiResponse<T>> noContent() {
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Converts Spring Data Page to PageResponse and wraps in ApiResponse.
     */
    public static <T, R> ResponseEntity<ApiResponse<PageResponse<R>>> pageResponse(
            Page<T> page, 
            Function<T, R> mapper,
            int originalPage) {
        PageResponse<R> response = PaginationUtil.toPageResponse(page, mapper, originalPage);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

