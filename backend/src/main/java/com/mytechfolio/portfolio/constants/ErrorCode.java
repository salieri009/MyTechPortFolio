package com.mytechfolio.portfolio.constants;

/**
 * Standardized error codes for API responses.
 * Improves maintainability and frontend error handling.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
public enum ErrorCode {
    // 4xx Client Errors
    VALIDATION_ERROR("VALIDATION_ERROR", "입력값 검증에 실패했습니다"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "요청한 리소스를 찾을 수 없습니다"),
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "이미 존재하는 리소스입니다"),
    UNAUTHORIZED("UNAUTHORIZED", "인증이 필요합니다"),
    FORBIDDEN("FORBIDDEN", "접근 권한이 없습니다"),
    BAD_REQUEST("BAD_REQUEST", "잘못된 요청입니다"),
    INVALID_ID_FORMAT("INVALID_ID_FORMAT", "잘못된 ID 형식입니다"),
    MISSING_PARAMETER("MISSING_PARAMETER", "필수 파라미터가 누락되었습니다"),
    INVALID_PARAMETER_TYPE("INVALID_PARAMETER_TYPE", "잘못된 파라미터 타입입니다"),
    
    // 5xx Server Errors
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다"),
    DATABASE_ERROR("DATABASE_ERROR", "데이터베이스 오류가 발생했습니다"),
    EXTERNAL_SERVICE_ERROR("EXTERNAL_SERVICE_ERROR", "외부 서비스 오류가 발생했습니다"),
    
    // Authentication & Authorization
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "인증에 실패했습니다"),
    TOKEN_EXPIRED("TOKEN_EXPIRED", "토큰이 만료되었습니다"),
    TOKEN_INVALID("TOKEN_INVALID", "유효하지 않은 토큰입니다"),
    INSUFFICIENT_PERMISSIONS("INSUFFICIENT_PERMISSIONS", "권한이 부족합니다");
    
    private final String code;
    private final String message;
    
    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
}

