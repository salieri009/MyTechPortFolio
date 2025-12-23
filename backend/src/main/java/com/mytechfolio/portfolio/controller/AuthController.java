package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.auth.GoogleLoginRequest;
import com.mytechfolio.portfolio.dto.auth.GitHubLoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mytechfolio.portfolio.constants.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST controller for authentication operations.
 * Handles Google OAuth, GitHub OAuth, token refresh, logout, and user profile.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping(ApiConstants.API_BASE_PATH + "/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "인증 및 인가 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google")
    @Operation(summary = "Google OAuth 로그인", description = "Google ID 토큰을 사용하여 인증합니다.")
    public ResponseEntity<ApiResponse<LoginResponse>> googleAuth(@Valid @RequestBody GoogleLoginRequest request) {
        log.info("Google OAuth login attempt");
        LoginResponse response = authService.authenticateWithGoogle(request.getGoogleIdToken());
        log.info("Google OAuth login successful");
        return ResponseEntity.ok(ApiResponse.success(response, "로그인 성공"));
    }

    @PostMapping("/github")
    @Operation(summary = "GitHub OAuth 로그인", description = "GitHub access token을 사용하여 인증합니다.")
    public ResponseEntity<ApiResponse<LoginResponse>> githubAuth(@Valid @RequestBody GitHubLoginRequest request) {
        log.info("GitHub OAuth login attempt");
        LoginResponse response = authService.authenticateWithGitHub(request.getAccessToken());
        log.info("GitHub OAuth login successful");
        return ResponseEntity.ok(ApiResponse.success(response, "로그인 성공"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshToken) {
        try {
            log.info("Token refresh attempt");
            String token = refreshToken.replace(ApiConstants.BEARER_PREFIX, "");
            LoginResponse response = authService.refreshToken(token);
            log.info("Token refresh successful");
            return ResponseEntity.ok(ApiResponse.success(response, "토큰 갱신 성공"));
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "사용자를 로그아웃하고 토큰을 무효화합니다.")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        String authHeader = request.getHeader(ApiConstants.AUTHORIZATION_HEADER);
        if (authHeader != null && authHeader.startsWith(ApiConstants.BEARER_PREFIX)) {
            String token = authHeader.substring(ApiConstants.BEARER_PREFIX.length());
            authService.logout(token);
            log.info("User logged out successfully");
        }
        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃 성공"));
    }

    @GetMapping("/profile")
    @Operation(summary = "사용자 프로필 조회", description = "현재 인증된 사용자의 프로필 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<Object>> getProfile(
            @RequestHeader(value = ApiConstants.AUTHORIZATION_HEADER, required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith(ApiConstants.BEARER_PREFIX)) {
            String token = authHeader.substring(ApiConstants.BEARER_PREFIX.length());
            Object profile = authService.getUserProfile(token);
            return ResponseEntity.ok(ApiResponse.success(profile));
        }
        return ResponseEntity.status(401)
                .body(ApiResponse.error(com.mytechfolio.portfolio.constants.ErrorCode.UNAUTHORIZED));
    }
}
