package com.mytechfolio.portfolio.security.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo userInfo;
    private boolean requiresTwoFactor;
    private boolean twoFactorEnabled;
    private String message;
    private TwoFactorSetup twoFactorSetup;
    
    // Constructors
    public AuthResponse() {}
    
    private AuthResponse(Builder builder) {
        this.accessToken = builder.accessToken;
        this.refreshToken = builder.refreshToken;
        this.tokenType = builder.tokenType;
        this.expiresIn = builder.expiresIn;
        this.userInfo = builder.userInfo;
        this.requiresTwoFactor = builder.requiresTwoFactor;
        this.twoFactorEnabled = builder.twoFactorEnabled;
        this.message = builder.message;
        this.twoFactorSetup = builder.twoFactorSetup;
    }
    
    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private Long expiresIn;
        private UserInfo userInfo;
        private boolean requiresTwoFactor;
        private boolean twoFactorEnabled;
        private String message;
        private TwoFactorSetup twoFactorSetup;
        
        public Builder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }
        
        public Builder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }
        
        public Builder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }
        
        public Builder expiresIn(Long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }
        
        public Builder userInfo(UserInfo userInfo) {
            this.userInfo = userInfo;
            return this;
        }
        
        public Builder requiresTwoFactor(boolean requiresTwoFactor) {
            this.requiresTwoFactor = requiresTwoFactor;
            return this;
        }
        
        public Builder twoFactorEnabled(boolean twoFactorEnabled) {
            this.twoFactorEnabled = twoFactorEnabled;
            return this;
        }
        
        public Builder message(String message) {
            this.message = message;
            return this;
        }
        
        public Builder twoFactorSetup(TwoFactorSetup twoFactorSetup) {
            this.twoFactorSetup = twoFactorSetup;
            return this;
        }
        
        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }
    
    // UserInfo nested class
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String pictureUrl;
        private Set<String> roles;
        private boolean isAdmin;
        private LocalDateTime createdAt;
        
        public UserInfo() {}
        
        private UserInfo(Builder builder) {
            this.id = builder.id;
            this.email = builder.email;
            this.name = builder.name;
            this.pictureUrl = builder.pictureUrl;
            this.roles = builder.roles;
            this.isAdmin = builder.isAdmin;
            this.createdAt = builder.createdAt;
        }
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private Long id;
            private String email;
            private String name;
            private String pictureUrl;
            private Set<String> roles;
            private boolean isAdmin;
            private LocalDateTime createdAt;
            
            public Builder id(Long id) {
                this.id = id;
                return this;
            }
            
            public Builder email(String email) {
                this.email = email;
                return this;
            }
            
            public Builder name(String name) {
                this.name = name;
                return this;
            }
            
            public Builder pictureUrl(String pictureUrl) {
                this.pictureUrl = pictureUrl;
                return this;
            }
            
            public Builder roles(Set<String> roles) {
                this.roles = roles;
                return this;
            }
            
            public Builder isAdmin(boolean isAdmin) {
                this.isAdmin = isAdmin;
                return this;
            }
            
            public Builder createdAt(LocalDateTime createdAt) {
                this.createdAt = createdAt;
                return this;
            }
            
            public UserInfo build() {
                return new UserInfo(this);
            }
        }
        
        // Getters
        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getPictureUrl() { return pictureUrl; }
        public Set<String> getRoles() { return roles; }
        public boolean isAdmin() { return isAdmin; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
    
    // TwoFactorSetup nested class
    public static class TwoFactorSetup {
        private String secret;
        private String qrCodeDataUri;
        
        public TwoFactorSetup() {}
        
        private TwoFactorSetup(Builder builder) {
            this.secret = builder.secret;
            this.qrCodeDataUri = builder.qrCodeDataUri;
        }
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private String secret;
            private String qrCodeDataUri;
            
            public Builder secret(String secret) {
                this.secret = secret;
                return this;
            }
            
            public Builder qrCodeDataUri(String qrCodeDataUri) {
                this.qrCodeDataUri = qrCodeDataUri;
                return this;
            }
            
            public TwoFactorSetup build() {
                return new TwoFactorSetup(this);
            }
        }
        
        // Getters
        public String getSecret() { return secret; }
        public String getQrCodeDataUri() { return qrCodeDataUri; }
    }
    
    // Getters
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getTokenType() { return tokenType; }
    public Long getExpiresIn() { return expiresIn; }
    public UserInfo getUserInfo() { return userInfo; }
    public boolean isRequiresTwoFactor() { return requiresTwoFactor; }
    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public String getMessage() { return message; }
    public TwoFactorSetup getTwoFactorSetup() { return twoFactorSetup; }
}
