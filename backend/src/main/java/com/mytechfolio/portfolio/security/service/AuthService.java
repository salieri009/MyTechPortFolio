package com.mytechfolio.portfolio.security.service;

import com.mytechfolio.portfolio.security.dto.AuthResponse;
import com.mytechfolio.portfolio.security.dto.LoginRequest;
import com.mytechfolio.portfolio.security.dto.TwoFactorSetupRequest;
import com.mytechfolio.portfolio.security.entity.Role;
import com.mytechfolio.portfolio.security.entity.User;
import com.mytechfolio.portfolio.security.repository.RoleRepository;
import com.mytechfolio.portfolio.security.repository.UserRepository;
import com.mytechfolio.portfolio.security.util.JwtUtil;
import com.mytechfolio.portfolio.security.util.TwoFactorAuthUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final GoogleOAuthService googleOAuthService;
    private final TwoFactorAuthUtil twoFactorAuthUtil;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuthService(UserRepository userRepository, 
                      RoleRepository roleRepository,
                      GoogleOAuthService googleOAuthService,
                      TwoFactorAuthUtil twoFactorAuthUtil,
                      JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.googleOAuthService = googleOAuthService;
        this.twoFactorAuthUtil = twoFactorAuthUtil;
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Google OAuth login/signup
     */
    public AuthResponse authenticateWithGoogle(LoginRequest loginRequest) {
        // Verify Google token
        GoogleOAuthService.GoogleUserInfo googleUserInfo = googleOAuthService.verifyGoogleToken(loginRequest.getGoogleIdToken());
        if (googleUserInfo == null) {
            throw new RuntimeException("Invalid Google token");
        }
        
        // Find or create user
        User user = findOrCreateUser(googleUserInfo);
        
        // Check if 2FA is enabled
        if (user.isTwoFactorEnabled()) {
            if (loginRequest.getTwoFactorCode() == null || loginRequest.getTwoFactorCode().trim().isEmpty()) {
                // Return response indicating 2FA is required
                return AuthResponse.builder()
                        .requiresTwoFactor(true)
                        .userInfo(AuthResponse.UserInfo.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .name(user.getName())
                                .build())
                        .build();
            }
            
            // Verify 2FA code
            if (!twoFactorAuthUtil.verifyCode(user.getTwoFactorSecret(), loginRequest.getTwoFactorCode())) {
                throw new RuntimeException("Invalid 2FA code");
            }
        }
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate tokens
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), roleNames);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessTokenValidityInMs() / 1000) // in seconds
                .userInfo(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .pictureUrl(user.getPictureUrl())
                        .roles(roleNames)
                        .isAdmin(user.isAdmin())
                        .build())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }
    
    /**
     * Setup 2FA for user
     */
    public AuthResponse.TwoFactorSetup setupTwoFactor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.isTwoFactorEnabled()) {
            throw new RuntimeException("2FA is already enabled for this user");
        }
        
        // Generate new secret
        String secret = twoFactorAuthUtil.generateSecret();
        String qrCodeDataUri = twoFactorAuthUtil.generateQrCodeDataUri(user.getEmail(), secret);
        
        // Save secret (but don't enable 2FA yet)
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
        
        return AuthResponse.TwoFactorSetup.builder()
                .secret(secret)
                .qrCodeDataUri(qrCodeDataUri)
                .build();
    }
    
    /**
     * Enable 2FA after verification
     */
    public AuthResponse enableTwoFactor(Long userId, TwoFactorSetupRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getTwoFactorSecret() == null) {
            throw new RuntimeException("2FA setup not initialized. Call setup endpoint first.");
        }
        
        // Verify the code
        if (!twoFactorAuthUtil.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            throw new RuntimeException("Invalid 2FA code");
        }
        
        // Enable 2FA
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
        
        log.info("2FA enabled for user: {}", user.getEmail());
        
        return AuthResponse.builder()
                .message("2FA enabled successfully")
                .twoFactorEnabled(true)
                .build();
    }
    
    /**
     * Disable 2FA
     */
    public AuthResponse disableTwoFactor(Long userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.isTwoFactorEnabled()) {
            throw new RuntimeException("2FA is not enabled for this user");
        }
        
        // Verify the code before disabling
        if (!twoFactorAuthUtil.verifyCode(user.getTwoFactorSecret(), code)) {
            throw new RuntimeException("Invalid 2FA code");
        }
        
        // Disable 2FA
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
        
        log.info("2FA disabled for user: {}", user.getEmail());
        
        return AuthResponse.builder()
                .message("2FA disabled successfully")
                .twoFactorEnabled(false)
                .build();
    }
    
    /**
     * Find or create user from Google user info
     */
    private User findOrCreateUser(GoogleOAuthService.GoogleUserInfo googleUserInfo) {
        Optional<User> existingUser = userRepository.findByGoogleIdWithRoles(googleUserInfo.getGoogleId());
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update user info from Google
            user.setName(googleUserInfo.getName());
            user.setPictureUrl(googleUserInfo.getPictureUrl());
            return userRepository.save(user);
        }
        
        // Create new user
        User newUser = new User();
        newUser.setEmail(googleUserInfo.getEmail());
        newUser.setGoogleId(googleUserInfo.getGoogleId());
        newUser.setName(googleUserInfo.getName());
        newUser.setPictureUrl(googleUserInfo.getPictureUrl());
        newUser.setEmailVerified(googleUserInfo.isEmailVerified());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());
        
        // Assign default USER role
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default USER role not found"));
        newUser.getRoles().add(userRole);
        
        User savedUser = userRepository.save(newUser);
        log.info("New user created: {}", savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Refresh access token
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        String tokenType = jwtUtil.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new RuntimeException("Token is not a refresh token");
        }
        
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), roleNames);
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Return the same refresh token
                .expiresIn(jwtUtil.getAccessTokenValidityInMs() / 1000)
                .userInfo(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .pictureUrl(user.getPictureUrl())
                        .roles(roleNames)
                        .isAdmin(user.isAdmin())
                        .build())
                .build();
    }
}
