package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.User;
import com.mytechfolio.portfolio.repository.UserRepository;
import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.auth.TwoFactorVerificationRequest;
import com.mytechfolio.portfolio.security.service.GoogleOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleOAuthService googleOAuthService;

    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        // For now, create a simple response for regular login
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        User user;
        if (userOpt.isEmpty()) {
            // Create new user for demo purposes
            user = User.builder()
                    .email(request.getEmail())
                    .name("Demo User")
                    .displayName("Demo User")
                    .profileImageUrl("")
                    .isEmailVerified(true)
                    .registrationSource("manual")
                    .lastLoginAt(LocalDateTime.now())
                    .build();
            user = userRepository.save(user);
            log.info("Created new user: {}", user.getEmail());
        } else {
            user = userOpt.get();
            user.setLastLoginAt(LocalDateTime.now());
            user = userRepository.save(user);
            log.info("User logged in: {}", user.getEmail());
        }

        return buildLoginResponse(user);
    }

    public LoginResponse authenticateWithGoogle(String googleToken) {
        log.info("Google OAuth authentication attempt");
        
        if (googleToken == null || googleToken.trim().isEmpty()) {
            throw new RuntimeException("Google ID token is required");
        }

        // Verify Google token
        GoogleOAuthService.GoogleUserInfo googleUserInfo = 
            googleOAuthService.verifyGoogleToken(googleToken);
        
        if (googleUserInfo == null) {
            throw new RuntimeException("Invalid Google token");
        }

        // Find or create user
        User user = findOrCreateUser(googleUserInfo);
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        user.updateLastLogin();
        user = userRepository.save(user);

        log.info("Google OAuth authentication successful for user: {}", user.getEmail());
        return buildLoginResponse(user);
    }

    public LoginResponse verifyTwoFactor(TwoFactorVerificationRequest request) {
        // For demo purposes, just return a successful login
        log.info("2FA verification for session: {}", request.getSessionId());
        
        return LoginResponse.builder()
                .accessToken(generateDemoToken())
                .refreshToken(generateDemoToken())
                .expiresIn(3600L)
                .build();
    }
    
    public LoginResponse refreshToken(String refreshToken) {
        // For demo purposes, generate new tokens
        return LoginResponse.builder()
                .accessToken(generateDemoToken())
                .refreshToken(generateDemoToken())
                .expiresIn(3600L)
                .build();
    }
    
    public void logout(String token) {
        log.info("User logout with token: {}", token.substring(0, Math.min(10, token.length())));
        // In a real implementation, you would invalidate tokens here
    }
    
    public Object getUserProfile(String token) {
        log.info("Get user profile for token: {}", token.substring(0, Math.min(10, token.length())));
        // For demo purposes, return a simple profile
        return java.util.Map.of(
            "email", "demo@example.com", 
            "name", "Demo User",
            "role", "USER"
        );
    }

    private User findOrCreateUser(GoogleOAuthService.GoogleUserInfo googleUserInfo) {
        Optional<User> userOpt = userRepository.findByEmail(googleUserInfo.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update user info from Google
            user.setName(googleUserInfo.getName());
            user.setDisplayName(googleUserInfo.getName());
            user.setProfileImageUrl(googleUserInfo.getPictureUrl());
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        
        // Create new user from Google info
        User newUser = User.builder()
                .email(googleUserInfo.getEmail())
                .name(googleUserInfo.getName())
                .displayName(googleUserInfo.getName())
                .profileImageUrl(googleUserInfo.getPictureUrl())
                .isEmailVerified(true)
                .registrationSource("google")
                .lastLoginAt(LocalDateTime.now())
                .build();
                
        log.info("Creating new Google user: {}", newUser.getEmail());
        return userRepository.save(newUser);
    }

    private LoginResponse buildLoginResponse(User user) {
        return LoginResponse.builder()
                .accessToken(generateDemoToken())
                .refreshToken(generateDemoToken())
                .expiresIn(3600L)
                .build();
    }

    private String generateDemoToken() {
        return "demo_token_" + UUID.randomUUID().toString().replace("-", "");
    }

    public boolean validateToken(String token) {
        // For demo purposes, accept any token that starts with "demo_"
        return token != null && token.startsWith("demo_");
    }

    public Optional<User> getCurrentUser(String token) {
        // In a real implementation, you would validate the token and return the user
        return Optional.empty();
    }
}
