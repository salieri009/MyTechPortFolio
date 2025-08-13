package com.mytechfolio.portfolio.domain.admin;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "admin_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "password")
public class AdminUser {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String password;
    
    @Indexed(unique = true)
    private String email;
    
    private String fullName;
    
    @Builder.Default
    private AdminRole role = AdminRole.VIEWER;
    
    @Builder.Default
    private Boolean enabled = true;
    
    @Builder.Default
    private Boolean accountNonExpired = true;
    
    @Builder.Default
    private Boolean accountNonLocked = true;
    
    @Builder.Default
    private Boolean credentialsNonExpired = true;
    
    private LocalDateTime lastLoginAt;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // OAuth 관련 필드 추가
    private String oauthProvider; // "google", "github" 등
    private String oauthId; // OAuth 제공자에서의 고유 ID
    private String profileImageUrl; // 프로필 이미지 URL
    
    // 2FA 관련 필드
    @Builder.Default
    private Boolean twoFactorEnabled = false;
    private String twoFactorSecret;
    
    // 세션 관리
    private String sessionId;
    private LocalDateTime lastActivity;
    private String deviceFingerprint;
    
    // Business Methods
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.lastActivity = LocalDateTime.now();
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updateProfile(String email, String fullName) {
        this.email = email;
        this.fullName = fullName;
    }
    
    public void updateUserInfo(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    public void deactivate() {
        this.enabled = false;
    }
    
    public void disable() {
        this.enabled = false;
    }

    public void activate() {
        this.enabled = true;
    }
    
    public void enable() {
        this.enabled = true;
    }
    
    public void changeRole(AdminRole newRole) {
        this.role = newRole;
    }

    public boolean isActive() {
        return enabled && accountNonExpired && accountNonLocked && credentialsNonExpired;
    }
    
    public String getDisplayName() {
        return fullName != null ? fullName : username;
    }
    
    // Permission and Authority Methods
    public boolean hasPermission(String permission) {
        return role.hasPermission(permission);
    }
    
    public boolean canManage(AdminUser targetUser) {
        // Super admin can manage anyone
        if (this.role == AdminRole.SUPER_ADMIN) {
            return true;
        }
        
        // Admin can manage content managers and viewers
        if (this.role == AdminRole.ADMIN) {
            return targetUser.role == AdminRole.CONTENT_MANAGER || 
                   targetUser.role == AdminRole.VIEWER;
        }
        
        // Content managers and viewers cannot manage other users
        return false;
    }
    
    public boolean hasHigherOrEqualAuthority(AdminUser otherUser) {
        return this.role.getLevel() >= otherUser.role.getLevel();
    }
    
    // OAuth 관련 메서드
    public boolean isOAuthUser() {
        return oauthProvider != null && oauthId != null;
    }
    
    public void updateOAuthInfo(String provider, String oauthId, String profileImageUrl) {
        this.oauthProvider = provider;
        this.oauthId = oauthId;
        this.profileImageUrl = profileImageUrl;
    }
    
    // 2FA 관련 메서드
    public void enableTwoFactor(String secret) {
        this.twoFactorEnabled = true;
        this.twoFactorSecret = secret;
    }
    
    public void disableTwoFactor() {
        this.twoFactorEnabled = false;
        this.twoFactorSecret = null;
    }
    
    // 세션 관리
    public void updateSession(String sessionId, String deviceFingerprint) {
        this.sessionId = sessionId;
        this.deviceFingerprint = deviceFingerprint;
        this.lastActivity = LocalDateTime.now();
    }
    
    public boolean isSessionValid(int sessionTimeoutMinutes) {
        if (lastActivity == null) return false;
        return lastActivity.isAfter(LocalDateTime.now().minusMinutes(sessionTimeoutMinutes));
    }
}