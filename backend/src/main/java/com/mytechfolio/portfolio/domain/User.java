package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String displayName;

    private String profileImageUrl;

    @Builder.Default
    private Role role = Role.USER;

    @Builder.Default
    private boolean enabled = true;

    private String oauthProvider;

    private String oauthId;

    // 2FA 지원
    @Builder.Default
    private boolean twoFactorEnabled = false;

    private String twoFactorSecret;

    // 세션 관리
    private LocalDateTime lastLogin;
    private String sessionId;
    private LocalDateTime lastActivity;
    private String deviceFingerprint;

    // 사용자 권한 확장 (다중 역할 지원)
    @Builder.Default
    private List<String> roles = new ArrayList<>();

    // 분석을 위한 추가 정보
    private String registrationSource; // "google", "email", "github"
    private String referrer; // 유입 경로
    private String userAgent; // 사용자 에이전트
    private String ipAddress; // 최근 접속 IP

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        USER("일반 사용자"),
        ADMIN("관리자"),
        RECRUITER("채용담당자"),
        GUEST("게스트");

        private final String description;

        Role(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Helper methods
    public boolean isAdmin() {
        return Role.ADMIN.equals(this.role) || roles.contains("ADMIN");
    }

    public boolean isRecruiter() {
        return Role.RECRUITER.equals(this.role) || roles.contains("RECRUITER");
    }

    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
        this.lastActivity = LocalDateTime.now();
    }

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

    // 권한 관리
    public void addRole(String roleName) {
        if (this.roles == null) {
            this.roles = new ArrayList<>();
        }
        if (!this.roles.contains(roleName)) {
            this.roles.add(roleName);
        }
    }

    public void removeRole(String roleName) {
        if (this.roles != null) {
            this.roles.remove(roleName);
        }
    }

    public boolean hasRole(String roleName) {
        return this.roles != null && this.roles.contains(roleName);
    }

    // 분석 정보 업데이트
    public void updateAnalyticsInfo(String userAgent, String ipAddress, String referrer) {
        this.userAgent = userAgent;
        this.ipAddress = ipAddress;
        this.referrer = referrer;
    }
}
