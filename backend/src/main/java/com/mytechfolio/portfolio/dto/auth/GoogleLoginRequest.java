package com.mytechfolio.portfolio.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {

	@NotBlank(message = "Google ID token is required")
	private String googleIdToken;

	private String twoFactorCode;
}


