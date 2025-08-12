package com.mytechfolio.portfolio.security.controller;

import com.mytechfolio.portfolio.security.dto.AuthResponse;
import com.mytechfolio.portfolio.security.dto.LoginRequest;
import com.mytechfolio.portfolio.security.dto.TwoFactorSetupRequest;
import com.mytechfolio.portfolio.security.service.AuthService;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    /**
     * Google OAuth login
     */
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticateWithGoogle(loginRequest);
            
            if (authResponse.isRequiresTwoFactor()) {
                return ResponseEntity.ok(ApiResponse.success(authResponse, "2FA code required"));
            }
            
            return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
        } catch (Exception e) {
            log.error("Google login failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
    
    /**
     * Setup 2FA
     */
    @PostMapping("/2fa/setup")
    public ResponseEntity<ApiResponse<AuthResponse.TwoFactorSetup>> setupTwoFactor() {
        try {
            Long userId = getCurrentUserId();
            AuthResponse.TwoFactorSetup setup = authService.setupTwoFactor(userId);
            
            return ResponseEntity.ok(ApiResponse.success(setup, "2FA setup initialized"));
        } catch (Exception e) {
            log.error("2FA setup failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("2FA setup failed: " + e.getMessage()));
        }
    }
    
    /**
     * Enable 2FA
     */
    @PostMapping("/2fa/enable")
    public ResponseEntity<ApiResponse<AuthResponse>> enableTwoFactor(@Valid @RequestBody TwoFactorSetupRequest request) {
        try {
            Long userId = getCurrentUserId();
            AuthResponse response = authService.enableTwoFactor(userId, request);
            
            return ResponseEntity.ok(ApiResponse.success(response, "2FA enabled successfully"));
        } catch (Exception e) {
            log.error("2FA enable failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("2FA enable failed: " + e.getMessage()));
        }
    }
    
    /**
     * Disable 2FA
     */
    @PostMapping("/2fa/disable")
    public ResponseEntity<ApiResponse<AuthResponse>> disableTwoFactor(@RequestBody TwoFactorSetupRequest request) {
        try {
            Long userId = getCurrentUserId();
            AuthResponse response = authService.disableTwoFactor(userId, request.getCode());
            
            return ResponseEntity.ok(ApiResponse.success(response, "2FA disabled successfully"));
        } catch (Exception e) {
            log.error("2FA disable failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("2FA disable failed: " + e.getMessage()));
        }
    }
    
    /**
     * Refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            AuthResponse response = authService.refreshToken(request.getRefreshToken());
            
            return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Token refresh failed: " + e.getMessage()));
        }
    }
    
    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Not authenticated"));
            }
            
            // This will be implemented after we create the security configuration
            // For now, return a placeholder
            return ResponseEntity.ok(ApiResponse.success(null, "User info retrieved"));
        } catch (Exception e) {
            log.error("Get current user failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user info: " + e.getMessage()));
        }
    }
    
    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        try {
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Logout failed: " + e.getMessage()));
        }
    }
    
    /**
     * Get current user ID from security context
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        // This will be properly implemented after security configuration
        // For now, throw an exception
        throw new RuntimeException("Security context not properly configured yet");
    }
    
    /**
     * Refresh token request DTO
     */
    public static class RefreshTokenRequest {
        private String refreshToken;
        
        public RefreshTokenRequest() {}
        
        public RefreshTokenRequest(String refreshToken) {
            this.refreshToken = refreshToken;
        }
        
        public String getRefreshToken() {
            return refreshToken;
        }
        
        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}
