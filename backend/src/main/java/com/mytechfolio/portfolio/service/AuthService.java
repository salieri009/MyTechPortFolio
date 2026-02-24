package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.User;
import com.mytechfolio.portfolio.repository.UserRepository;
import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.security.service.GoogleOAuthService;
import com.mytechfolio.portfolio.security.service.GitHubOAuthService;
import com.mytechfolio.portfolio.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleOAuthService googleOAuthService;
    private final GitHubOAuthService gitHubOAuthService;
    private final JwtUtil jwtUtil;

    /**
     * In-memory token blacklist for logout.
     * In production, use Redis or a distributed cache instead.
     */
    private final Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();

    /**
     * Check if a token has been blacklisted (logged out).
     */
    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.contains(token);
    }

    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // For now, create a simple response for regular login
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        User user;
        if (userOpt.isEmpty()) {
            // Create new user for demo purposes
            user = User.builder()
                    .email(request.getEmail())
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
        GoogleOAuthService.GoogleUserInfo googleUserInfo = googleOAuthService.verifyGoogleToken(googleToken);

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

    /**
     * Authenticate user with GitHub OAuth access token.
     */
    public LoginResponse authenticateWithGitHub(String accessToken) {
        log.info("GitHub OAuth authentication attempt");

        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new RuntimeException("GitHub access token is required");
        }

        // Verify GitHub token
        GitHubOAuthService.GitHubUserInfo gitHubUserInfo = gitHubOAuthService.verifyGitHubToken(accessToken);

        if (gitHubUserInfo == null) {
            throw new RuntimeException("Invalid GitHub token");
        }

        // Find or create user
        User user = findOrCreateGitHubUser(gitHubUserInfo);

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        user.updateLastLogin();
        user = userRepository.save(user);

        log.info("GitHub OAuth authentication successful for user: {}", user.getEmail());
        return buildLoginResponse(user);
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }
        if (isTokenBlacklisted(refreshToken)) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        String email = extractEmailFromRefreshToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is disabled");
        }

        // Blacklist old refresh token (rotation)
        tokenBlacklist.add(refreshToken);

        return buildLoginResponse(user);
    }

    public void logout(String token) {
        log.info("User logout requested");
        if (token != null && !token.isBlank()) {
            tokenBlacklist.add(token);
            log.info("Token added to blacklist");
        }
    }

    public Object getUserProfile(String token) {
        log.info("Get user profile for token: {}", token.substring(0, Math.min(10, token.length())));
        if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }
        var claims = jwtUtil.parseClaims(token);
        return java.util.Map.of(
                "email", claims.getSubject(),
                "role", String.valueOf(claims.getOrDefault("role", "USER")),
                "roles", claims.getOrDefault("roles", java.util.List.of()));
    }

    private User findOrCreateUser(GoogleOAuthService.GoogleUserInfo googleUserInfo) {
        Optional<User> userOpt = userRepository.findByEmail(googleUserInfo.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update user info from Google
            user.setDisplayName(googleUserInfo.getName());
            user.setProfileImageUrl(googleUserInfo.getPictureUrl());
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        }

        // Create new user from Google info
        User newUser = User.builder()
                .email(googleUserInfo.getEmail())
                .displayName(googleUserInfo.getName())
                .profileImageUrl(googleUserInfo.getPictureUrl())
                .isEmailVerified(true)
                .registrationSource("google")
                .lastLoginAt(LocalDateTime.now())
                .build();

        log.info("Creating new Google user: {}", newUser.getEmail());
        return userRepository.save(newUser);
    }

    /**
     * Find or create user from GitHub OAuth info.
     */
    private User findOrCreateGitHubUser(GitHubOAuthService.GitHubUserInfo gitHubUserInfo) {
        Optional<User> userOpt = userRepository.findByEmail(gitHubUserInfo.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update user info from GitHub
            user.setDisplayName(gitHubUserInfo.getName());
            user.setProfileImageUrl(gitHubUserInfo.getAvatarUrl());
            user.setOauthProvider("github");
            user.setOauthId(gitHubUserInfo.getGithubId());
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        }

        // Create new user from GitHub info
        User newUser = User.builder()
                .email(gitHubUserInfo.getEmail())
                .displayName(gitHubUserInfo.getName())
                .profileImageUrl(gitHubUserInfo.getAvatarUrl())
                .oauthProvider("github")
                .oauthId(gitHubUserInfo.getGithubId())
                .isEmailVerified(true)
                .registrationSource("github")
                .lastLoginAt(LocalDateTime.now())
                .build();

        log.info("Creating new GitHub user: {}", newUser.getEmail());
        return userRepository.save(newUser);
    }

    private LoginResponse buildLoginResponse(User user) {
        return LoginResponse.builder()
                .accessToken(generateAccessTokenFor(user))
                .refreshToken(generateRefreshTokenFor(user))
                .expiresIn(86400L)
                .userInfo(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .displayName(user.getDisplayName())
                        .profileImageUrl(user.getProfileImageUrl())
                        .role(user.getRole() != null ? user.getRole().name() : "USER")
                        .twoFactorEnabled(Boolean.TRUE.equals(user.isTwoFactorEnabled()))
                        .build())
                .build();
    }

    private String generateAccessTokenFor(User user) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole() != null ? user.getRole().name() : "USER");
        claims.put("roles", user.getRoles() != null ? user.getRoles() : java.util.List.of());
        return jwtUtil.generateAccessToken(user.getEmail(), claims);
    }

    private String generateRefreshTokenFor(User user) {
        return jwtUtil.generateRefreshToken(user.getEmail());
    }

    private String generateAccessTokenForEmail(String email) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        claims.put("roles", java.util.List.of());
        return jwtUtil.generateAccessToken(email, claims);
    }

    private String extractEmailFromRefreshToken(String refreshToken) {
        var claims = jwtUtil.parseClaims(refreshToken);
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        return token != null && jwtUtil.isTokenValid(token);
    }

    public Optional<User> getCurrentUser(String token) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return Optional.empty();
        }
        var claims = jwtUtil.parseClaims(token);
        return userRepository.findByEmail(claims.getSubject());
    }
}
