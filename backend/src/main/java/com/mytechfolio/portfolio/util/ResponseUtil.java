package com.mytechfolio.portfolio.util;

import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.dto.response.PageResponse;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.function.Function;

/**
 * Utility class for creating standardized API responses.
 * Improves code reusability and consistency across controllers.
 * Automatically sets metadata (requestId, timestamp, version) from MDC.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public final class ResponseUtil {
    
    private static final String REQUEST_ID_MDC_KEY = "requestId";
    private static final String API_VERSION = "v1";
    
    private ResponseUtil() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
    
    /**
     * Enriches ApiResponse with metadata from MDC (requestId, timestamp, version).
     * 
     * @param response ApiResponse to enrich
     * @param <T> Response data type
     * @return Enriched ApiResponse
     */
    public static <T> ApiResponse<T> enrichWithMetadata(ApiResponse<T> response) {
        if (response.getMetadata() != null) {
            // Set request ID from MDC if available
            String requestId = MDC.get(REQUEST_ID_MDC_KEY);
            if (requestId != null && !requestId.isBlank()) {
                response.getMetadata().setRequestId(requestId);
            }
            // Timestamp and version are already set in ApiResponse constructor
        }
        return response;
    }
    
    /**
     * Creates a successful response with data.
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        ApiResponse<T> response = ApiResponse.success(data);
        return ResponseEntity.ok(enrichWithMetadata(response));
    }
    
    /**
     * Creates a successful response with data and message.
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String message) {
        ApiResponse<T> response = ApiResponse.success(data, message);
        return ResponseEntity.ok(enrichWithMetadata(response));
    }
    
    /**
     * Creates a created response (201) with data.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        ApiResponse<T> response = ApiResponse.success(data);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrichWithMetadata(response));
    }
    
    /**
     * Creates a created response (201) with data and message.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        ApiResponse<T> response = ApiResponse.success(data, message);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrichWithMetadata(response));
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
        ApiResponse<PageResponse<R>> apiResponse = ApiResponse.success(response);
        return ResponseEntity.ok(enrichWithMetadata(apiResponse));
    }
}

