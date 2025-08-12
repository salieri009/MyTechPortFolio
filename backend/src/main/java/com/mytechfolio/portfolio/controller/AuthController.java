package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.auth.TwoFactorVerificationRequest;
import com.mytechfolio.portfolio.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        LoginResponse response = authService.login(request);
        
        if (response.isRequiresTwoFactor()) {
            log.info("2FA required for user: {}", request.getEmail());
        } else {
            log.info("Login successful for user: {}", request.getEmail());
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<LoginResponse> verifyTwoFactor(
            @Valid @RequestBody TwoFactorVerificationRequest request
    ) {
        log.info("2FA verification attempt for session: {}", request.getSessionId());
        
        LoginResponse response = authService.verifyTwoFactor(request);
        
        log.info("2FA verification successful for session: {}", request.getSessionId());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleAuth(@RequestBody String googleToken) {
        log.info("Google OAuth login attempt");
        
        LoginResponse response = authService.authenticateWithGoogle(googleToken);
        
        log.info("Google OAuth login successful");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            @RequestHeader("Authorization") String refreshToken
    ) {
        log.info("Token refresh attempt");
        
        String token = refreshToken.replace("Bearer ", "");
        LoginResponse response = authService.refreshToken(token);
        
        log.info("Token refresh successful");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
            log.info("User logged out successfully");
        }
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Object profile = authService.getUserProfile(token);
            return ResponseEntity.ok(profile);
        }
        
        return ResponseEntity.unauthorized().build();
    }
}
