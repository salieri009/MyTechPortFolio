package com.mytechfolio.portfolio.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytechfolio.portfolio.constants.ErrorCode;

import java.time.Instant;
import java.util.Map;

/**
 * Standardized API response wrapper.
 * Provides consistent response structure for frontend consumption.
 * 
 * @param <T> Type of the response data
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;
    private String errorCode;
    private Map<String, String> errors; // For validation errors
    private ResponseMetadata metadata;

    // Constructors
    public ApiResponse() {
        this.metadata = new ResponseMetadata();
    }
    
    public ApiResponse(boolean success, T data, String message, String error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.metadata = new ResponseMetadata();
    }
    
    public ApiResponse(boolean success, T data, String message, String error, String errorCode, Map<String, String> errors) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.errorCode = errorCode;
        this.errors = errors;
        this.metadata = new ResponseMetadata();
    }

    // Static factory methods for success
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    // Static factory methods for errors
    public static <T> ApiResponse<T> error(String errorMessage) {
        return new ApiResponse<>(false, null, null, errorMessage);
    }
    
    public static <T> ApiResponse<T> error(String errorMessage, Map<String, String> errors) {
        return new ApiResponse<>(false, null, null, errorMessage, null, errors);
    }
    
    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(false, null, null, errorCode.getMessage(), errorCode.getCode(), null);
    }
    
    public static <T> ApiResponse<T> error(ErrorCode errorCode, Map<String, String> errors) {
        return new ApiResponse<>(false, null, null, errorCode.getMessage(), errorCode.getCode(), errors);
    }
    
    public static <T> ApiResponse<T> error(ErrorCode errorCode, String customMessage) {
        return new ApiResponse<>(false, null, null, customMessage, errorCode.getCode(), null);
    }

    // Getters and Setters
    public boolean isSuccess() { 
        return success; 
    }
    
    public void setSuccess(boolean success) { 
        this.success = success; 
    }
    
    public T getData() { 
        return data; 
    }
    
    public void setData(T data) { 
        this.data = data; 
    }
    
    public String getMessage() { 
        return message; 
    }
    
    public void setMessage(String message) { 
        this.message = message; 
    }
    
    public String getError() { 
        return error; 
    }
    
    public void setError(String error) { 
        this.error = error; 
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public Map<String, String> getErrors() { 
        return errors; 
    }
    
    public void setErrors(Map<String, String> errors) { 
        this.errors = errors; 
    }
    
    public ResponseMetadata getMetadata() {
        return metadata;
    }
    
    public void setMetadata(ResponseMetadata metadata) {
        this.metadata = metadata;
    }
    
    /**
     * Response metadata for additional information.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ResponseMetadata {
        private Instant timestamp;
        private String version;
        private String requestId;
        
        public ResponseMetadata() {
            this.timestamp = Instant.now();
            this.version = "v1";
        }
        
        public Instant getTimestamp() {
            return timestamp;
        }
        
        public void setTimestamp(Instant timestamp) {
            this.timestamp = timestamp;
        }
        
        public String getVersion() {
            return version;
        }
        
        public void setVersion(String version) {
            this.version = version;
        }
        
        public String getRequestId() {
            return requestId;
        }
        
        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }
    }
}
