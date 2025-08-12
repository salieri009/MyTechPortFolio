package com.mytechfolio.portfolio.dto.response;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;

    // Constructors
    public ApiResponse() {}
    
    public ApiResponse(boolean success, T data, String message, String error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
    }

    // Static factory methods
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> error(String errorMessage) {
        return new ApiResponse<>(false, null, null, errorMessage);
    }

    // Getters
    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public String getMessage() { return message; }
    public String getError() { return error; }
    
    // Setters
    public void setSuccess(boolean success) { this.success = success; }
    public void setData(T data) { this.data = data; }
    public void setMessage(String message) { this.message = message; }
    public void setError(String error) { this.error = error; }
}
