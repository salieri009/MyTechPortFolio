package com.mytechfolio.portfolio.controller;

import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.auth.TwoFactorVerificationRequest;
import com.mytechfolio.portfolio.dto.response.ApiResponse;
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
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Object profile = authService.getUserProfile(token);
            return ResponseEntity.ok(profile);
        }
        
        return ResponseEntity.status(401).build();
    }

    // Development login endpoints
    @GetMapping("/login")
    public ResponseEntity<String> getLoginPage() {
        return ResponseEntity.ok("""
            <html>
            <head><title>Login - MyPortfolio</title></head>
            <body>
                <h1>MyPortfolio Login</h1>
                <p>Choose your login method:</p>
                <a href="/api/oauth2/authorization/google" style="padding: 10px 20px; background: #4285f4; color: white; text-decoration: none; border-radius: 5px;">
                    Login with Google
                </a>
                <br><br>
                <a href="/api/techstacks" style="padding: 10px 20px; background: #34a853; color: white; text-decoration: none; border-radius: 5px;">
                    View Tech Stacks (Public)
                </a>
            </body>
            </html>
            """);
    }

    @GetMapping("/success")
    public ResponseEntity<String> getSuccessPage() {
        return ResponseEntity.ok("""
            <html>
            <head><title>Login Success - MyPortfolio</title></head>
            <body>
                <h1>Login Successful! 🎉</h1>
                <p>You are now logged in.</p>
                <a href="/api/techstacks" style="padding: 10px 20px; background: #34a853; color: white; text-decoration: none; border-radius: 5px;">
                    View Tech Stacks
                </a>
                <br><br>
                <a href="/api/auth/logout" style="padding: 10px 20px; background: #ea4335; color: white; text-decoration: none; border-radius: 5px;">
                    Logout
                </a>
            </body>
            </html>
            """);
    }

    @GetMapping("/failure")
    public ResponseEntity<String> getFailurePage() {
        return ResponseEntity.ok("""
            <html>
            <head><title>Login Failed - MyPortfolio</title></head>
            <body>
                <h1>Login Failed ❌</h1>
                <p>Please try again.</p>
                <a href="/api/auth/login" style="padding: 10px 20px; background: #4285f4; color: white; text-decoration: none; border-radius: 5px;">
                    Try Again
                </a>
            </body>
            </html>
            """);
    }
}
