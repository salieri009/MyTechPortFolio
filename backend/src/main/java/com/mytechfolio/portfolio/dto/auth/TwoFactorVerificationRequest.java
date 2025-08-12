package com.mytechfolio.portfolio.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFactorVerificationRequest {
    
    @NotBlank(message = "Session ID is required")
    private String sessionId;
    
    @NotBlank(message = "2FA code is required")
    private String code;
    
    private String deviceInfo;
}
