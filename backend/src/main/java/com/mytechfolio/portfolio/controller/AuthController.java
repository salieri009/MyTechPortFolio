package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.auth.GoogleLoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
import com.mytechfolio.portfolio.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> googleAuth(@Valid @RequestBody GoogleLoginRequest request) {
        log.info("Google OAuth login attempt");
        LoginResponse response = authService.authenticateWithGoogle(request.getGoogleIdToken());
        log.info("Google OAuth login successful");
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshToken
    ) {
        try {
            log.info("Token refresh attempt");
            String token = refreshToken.replace("Bearer ", "");
            LoginResponse response = authService.refreshToken(token);
            log.info("Token refresh successful");
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
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
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Object profile = authService.getUserProfile(token);
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.status(401).build();
    }
}
