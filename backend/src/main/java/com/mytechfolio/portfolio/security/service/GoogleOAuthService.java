package com.mytechfolio.portfolio.security.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GoogleOAuthService {
    
    private static final Logger log = LoggerFactory.getLogger(GoogleOAuthService.class);
    private static final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";
    
    private final RestTemplate restTemplate;
    private final String clientId;
    
    public GoogleOAuthService(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        this.clientId = clientId;
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Verify Google ID token and extract user information
     */
    @SuppressWarnings("unchecked")
    public GoogleUserInfo verifyGoogleToken(String idToken) {
        try {
            String url = GOOGLE_TOKEN_INFO_URL + idToken;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> tokenInfo = (Map<String, Object>) response.getBody();
                
                // Verify audience matches our client ID
                String audience = (String) tokenInfo.get("aud");
                if (!clientId.equals(audience)) {
                    log.warn("Token audience mismatch. Expected: {}, Got: {}", clientId, audience);
                    return null;
                }
                
                String googleId = (String) tokenInfo.get("sub");
                String email = (String) tokenInfo.get("email");
                String name = (String) tokenInfo.get("name");
                String pictureUrl = (String) tokenInfo.get("picture");
                Boolean emailVerified = (Boolean) tokenInfo.get("email_verified");
                
                return GoogleUserInfo.builder()
                        .googleId(googleId)
                        .email(email)
                        .name(name)
                        .pictureUrl(pictureUrl)
                        .emailVerified(emailVerified != null && emailVerified)
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to verify Google token: {}", e.getMessage());
        }
        return null;
    }
    
    /**
     * Google user information DTO
     */
    public static class GoogleUserInfo {
        private String googleId;
        private String email;
        private String name;
        private String pictureUrl;
        private boolean emailVerified;
        
        // Constructor
        private GoogleUserInfo(String googleId, String email, String name, String pictureUrl, boolean emailVerified) {
            this.googleId = googleId;
            this.email = email;
            this.name = name;
            this.pictureUrl = pictureUrl;
            this.emailVerified = emailVerified;
        }
        
        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private String googleId;
            private String email;
            private String name;
            private String pictureUrl;
            private boolean emailVerified;
            
            public Builder googleId(String googleId) {
                this.googleId = googleId;
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
            
            public Builder emailVerified(boolean emailVerified) {
                this.emailVerified = emailVerified;
                return this;
            }
            
            public GoogleUserInfo build() {
                return new GoogleUserInfo(googleId, email, name, pictureUrl, emailVerified);
            }
        }
        
        // Getters
        public String getGoogleId() { return googleId; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getPictureUrl() { return pictureUrl; }
        public boolean isEmailVerified() { return emailVerified; }
    }
}
