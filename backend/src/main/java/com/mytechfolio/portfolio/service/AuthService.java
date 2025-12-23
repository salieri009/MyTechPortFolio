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
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleOAuthService googleOAuthService;
    private final GitHubOAuthService gitHubOAuthService;
    private final JwtUtil jwtUtil;

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
        // For demo purposes, generate new tokens
        return LoginResponse.builder()
                .accessToken(generateAccessTokenForEmail(extractEmailFromRefreshToken(refreshToken)))
                .refreshToken(refreshToken)
                .expiresIn(3600L)
                .build();
    }

    public void logout(String token) {
        log.info("User logout with token: {}", token.substring(0, Math.min(10, token.length())));
        // In a real implementation, you would invalidate tokens here
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

    /**
     * Find or create user from GitHub OAuth info.
     */
    private User findOrCreateGitHubUser(GitHubOAuthService.GitHubUserInfo gitHubUserInfo) {
        Optional<User> userOpt = userRepository.findByEmail(gitHubUserInfo.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update user info from GitHub
            user.setName(gitHubUserInfo.getName());
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
                .name(gitHubUserInfo.getName())
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
                .expiresIn(3600L)
                .userInfo(LoginResponse.UserInfo.builder()
                        .id(null)
                        .email(user.getEmail())
                        .displayName(user.getDisplayName() != null ? user.getDisplayName() : user.getName())
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
        // In a real implementation, you would validate the token and return the user
        return Optional.empty();
    }
}
