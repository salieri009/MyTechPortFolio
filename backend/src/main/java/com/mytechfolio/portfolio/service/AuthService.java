package com.mytechfolio.portfolio.service;

import com.mytechfolio.portfolio.domain.User;
import com.mytechfolio.portfolio.repository.UserRepository;
import com.mytechfolio.portfolio.dto.auth.LoginRequest;
import com.mytechfolio.portfolio.dto.auth.LoginResponse;
import com.mytechfolio.portfolio.security.service.GoogleOAuthService;
import com.mytechfolio.portfolio.security.service.GitHubOAuthService;
import com.mytechfolio.portfolio.security.util.JwtUtil;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
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
    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final CodeVerifier codeVerifier = new DefaultCodeVerifier(
            new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6),
            new SystemTimeProvider()
    );

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

    public LoginResponse authenticateWithGoogle(String googleToken, String twoFactorCode) {
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

        LoginResponse twoFactorChallenge = challengeIfTwoFactorRequired(user, twoFactorCode);
        if (twoFactorChallenge != null) {
            return twoFactorChallenge;
        }

        log.info("Google OAuth authentication successful for user: {}", user.getEmail());
        return buildLoginResponse(user);
    }

    /**
     * Authenticate user with GitHub OAuth authorization code.
     */
    public LoginResponse authenticateWithGitHub(String authorizationCode, String twoFactorCode) {
        log.info("GitHub OAuth authentication attempt");

        if (authorizationCode == null || authorizationCode.trim().isEmpty()) {
            throw new RuntimeException("GitHub authorization code is required");
        }

        String accessToken = gitHubOAuthService.exchangeAuthorizationCodeForAccessToken(authorizationCode);

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

        LoginResponse twoFactorChallenge = challengeIfTwoFactorRequired(user, twoFactorCode);
        if (twoFactorChallenge != null) {
            return twoFactorChallenge;
        }

        log.info("GitHub OAuth authentication successful for user: {}", user.getEmail());
        return buildLoginResponse(user);
    }

    public LoginResponse verifyTwoFactorLogin(String sessionId, String code) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new RuntimeException("Session ID is required for 2FA verification");
        }
        if (code == null || code.isBlank()) {
            throw new RuntimeException("2FA code is required");
        }

        User user = userRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Invalid 2FA session"));

        if (!Boolean.TRUE.equals(user.isTwoFactorEnabled())) {
            throw new RuntimeException("Two-factor authentication is not enabled for this user");
        }

        if (!isValidTwoFactorCode(user.getTwoFactorSecret(), code)) {
            throw new RuntimeException("Invalid 2FA code");
        }

        user.setSessionId(null);
        user.setLastActivity(LocalDateTime.now());
        user = userRepository.save(user);

        return buildLoginResponse(user);
    }

    public java.util.Map<String, String> setupTwoFactor(String accessToken) {
        User user = getUserFromAccessToken(accessToken);

        String secret = secretGenerator.generate();
        user.setTwoFactorSecret(secret);
        user = userRepository.save(user);

        QrData data = new QrData.Builder()
                .label(user.getEmail())
                .secret(secret)
                .issuer("MyPortfolio")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        return java.util.Map.of(
                "secret", secret,
                "qrCodeUrl", data.getUri()
        );
    }

    public java.util.Map<String, Boolean> confirmTwoFactorSetup(String accessToken, String code) {
        User user = getUserFromAccessToken(accessToken);

        if (user.getTwoFactorSecret() == null || user.getTwoFactorSecret().isBlank()) {
            throw new RuntimeException("2FA setup has not been initialized");
        }
        if (!isValidTwoFactorCode(user.getTwoFactorSecret(), code)) {
            throw new RuntimeException("Invalid 2FA code");
        }

        user.enableTwoFactor(user.getTwoFactorSecret());
        userRepository.save(user);
        return java.util.Map.of("twoFactorEnabled", true);
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
            .requiresTwoFactor(false)
            .sessionId(null)
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

    private LoginResponse challengeIfTwoFactorRequired(User user, String twoFactorCode) {
        if (!Boolean.TRUE.equals(user.isTwoFactorEnabled())) {
            return null;
        }

        if (twoFactorCode == null || twoFactorCode.isBlank()) {
            String sessionId = UUID.randomUUID().toString();
            user.updateSession(sessionId, "oauth-login");
            userRepository.save(user);

            return LoginResponse.builder()
                    .requiresTwoFactor(true)
                    .sessionId(sessionId)
                    .expiresIn(0L)
                    .tokenType("Bearer")
                    .userInfo(LoginResponse.UserInfo.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .displayName(user.getDisplayName())
                            .profileImageUrl(user.getProfileImageUrl())
                            .role(user.getRole() != null ? user.getRole().name() : "USER")
                            .twoFactorEnabled(true)
                            .build())
                    .build();
        }

        if (!isValidTwoFactorCode(user.getTwoFactorSecret(), twoFactorCode)) {
            throw new RuntimeException("Invalid 2FA code");
        }

        return null;
    }

    private boolean isValidTwoFactorCode(String secret, String code) {
        if (secret == null || secret.isBlank() || code == null || code.isBlank()) {
            return false;
        }
        return codeVerifier.isValidCode(secret, code);
    }

    private User getUserFromAccessToken(String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            throw new RuntimeException("Access token is required");
        }
        if (!jwtUtil.isTokenValid(accessToken)) {
            throw new RuntimeException("Invalid access token");
        }

        String email = jwtUtil.parseClaims(accessToken).getSubject();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
