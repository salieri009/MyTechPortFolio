package com.mytechfolio.portfolio.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for GitHub OAuth login request.
 * Contains the GitHub access token obtained from OAuth flow.
 */
@Data
public class GitHubLoginRequest {

    @NotBlank(message = "GitHub access token is required")
    @Size(min = 10, max = 500, message = "Invalid GitHub access token format")
    private String accessToken;

    @Size(min = 6, max = 6, message = "2FA code must be exactly 6 digits")
    @Pattern(regexp = "^[0-9]{6}$", message = "2FA code must be 6 digits")
    private String twoFactorCode;
}
