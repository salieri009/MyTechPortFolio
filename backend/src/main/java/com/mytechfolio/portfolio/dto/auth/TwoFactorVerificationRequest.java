package com.mytechfolio.portfolio.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFactorVerificationRequest {

    private String sessionId;

    @JsonAlias("token")
    @NotBlank(message = "2FA code is required")
    private String code;

    private String deviceInfo;
}
