package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.User;
import com.mytechfolio.portfolio.repository.UserRepository;
import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
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

    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        // For now, create a simple response
        // In a real implementation, you would validate credentials here
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        User user;
        if (userOpt.isEmpty()) {
            // Create new user for demo purposes
            user = User.builder()
                    .email(request.getEmail())
                    .name("Demo User")
                    .profilePictureUrl("")
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

        // Convert User to UserInfo
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .id(null) // String ID cannot be converted to Long easily, using null for demo
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole().name())
                .twoFactorEnabled(false)
                .build();

        return LoginResponse.builder()
                .accessToken(generateDemoToken())
                .refreshToken(generateDemoToken())
                .expiresIn(3600L) // 1 hour
                .user(userInfo)
                .build();
    }

    public void logout(String userId) {
        log.info("User logout: {}", userId);
        // In a real implementation, you would invalidate tokens here
    }

    public Optional<User> getCurrentUser(String token) {
        // In a real implementation, you would validate the token and return the user
        // For demo purposes, return empty
        return Optional.empty();
    }

    private String generateDemoToken() {
        return "demo_" + UUID.randomUUID().toString();
    }

    public boolean validateToken(String token) {
        // For demo purposes, accept any token that starts with "demo_"
        return token != null && token.startsWith("demo_");
    }
    
    public LoginResponse verifyTwoFactor(com.mytechfolio.portfolio.dto.auth.TwoFactorVerificationRequest request) {
        // For demo purposes, just return a successful login
        return LoginResponse.builder()
                .accessToken(generateDemoToken())
                .refreshToken(generateDemoToken())
                .expiresIn(3600L)
                .build();
    }
    
    public LoginResponse authenticateWithGoogle(String googleToken) {
        // For demo purposes, create a demo response
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
    
    public Object getUserProfile(String token) {
        // For demo purposes, return a simple profile
        return java.util.Map.of("email", "demo@example.com", "name", "Demo User");
    }
}
