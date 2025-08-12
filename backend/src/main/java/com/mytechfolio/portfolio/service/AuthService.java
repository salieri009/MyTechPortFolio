package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.dto.auth.TwoFactorVerificationRequest;
import com.mytechfolio.portfolio.entity.User;
import com.mytechfolio.portfolio.repository.UserRepository;
import com.mytechfolio.portfolio.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    // Temporary storage for 2FA sessions (in production, use Redis)
    private final Map<String, TwoFactorSession> twoFactorSessions = new ConcurrentHashMap<>();

    public LoginResponse login(LoginRequest request) {
        log.debug("Attempting login for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        // For simplicity, we'll create a user if password is empty (OAuth only)
        // In production, use proper password encoding
        if (user.getPassword() != null && !user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Check if 2FA is enabled
        if (user.isTwoFactorEnabled()) {
            String sessionId = UUID.randomUUID().toString();
            twoFactorSessions.put(sessionId, new TwoFactorSession(user.getId(), LocalDateTime.now().plusMinutes(5)));
            
            return LoginResponse.builder()
                    .requiresTwoFactor(true)
                    .sessionId(sessionId)
                    .build();
        }

        // Generate tokens
        return generateTokenResponse(user);
    }

    public LoginResponse verifyTwoFactor(TwoFactorVerificationRequest request) {
        log.debug("Verifying 2FA for session: {}", request.getSessionId());
        
        TwoFactorSession session = twoFactorSessions.get(request.getSessionId());
        if (session == null || session.isExpired()) {
            throw new RuntimeException("Invalid or expired session");
        }

        User user = userRepository.findById(session.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // For simplicity, accept "123456" as valid 2FA code
        if (!"123456".equals(request.getCode())) {
            throw new RuntimeException("Invalid 2FA code");
        }

        // Remove the session
        twoFactorSessions.remove(request.getSessionId());

        // Generate tokens
        return generateTokenResponse(user);
    }

    public LoginResponse authenticateWithGoogle(String googleToken) {
        log.debug("Authenticating with Google token");
        
        // For now, create or find a test user
        User user = userRepository.findByEmail("admin@portfolio.com")
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email("admin@portfolio.com")
                            .displayName("Admin User")
                            .role(User.Role.ADMIN)
                            .oauthProvider("google")
                            .oauthId("google-test-id")
                            .enabled(true)
                            .build();
                    return userRepository.save(newUser);
                });

        user.updateLastLogin();
        userRepository.save(user);

        return generateTokenResponse(user);
    }

    public LoginResponse refreshToken(String refreshToken) {
        log.debug("Refreshing token");
        
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return generateTokenResponse(user);
    }

    public void logout(String token) {
        log.debug("Logging out user");
        // In production, you would add the token to a blacklist
    }

    public Object getUserProfile(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        Long userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return LoginResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole().toString())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }

    private LoginResponse generateTokenResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(
                user.getId(), 
                user.getEmail(), 
                java.util.Set.of(user.getRole().toString())
        );
        
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessTokenValidityInMs() / 1000)
                .requiresTwoFactor(false)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .displayName(user.getDisplayName())
                        .profileImageUrl(user.getProfileImageUrl())
                        .role(user.getRole().toString())
                        .twoFactorEnabled(user.isTwoFactorEnabled())
                        .build())
                .build();
    }

    private static class TwoFactorSession {
        private final Long userId;
        private final LocalDateTime expiresAt;

        public TwoFactorSession(Long userId, LocalDateTime expiresAt) {
            this.userId = userId;
            this.expiresAt = expiresAt;
        }

        public Long getUserId() {
            return userId;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }
}
