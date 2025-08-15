package com.mytechfolio.portfolio.security.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class GoogleOAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Data
    public static class GoogleUserInfo {
        private String googleId;
        private String email;
        private String name;
        private String pictureUrl;
        private boolean emailVerified;
    }

    public GoogleUserInfo verifyGoogleToken(String idToken) {
        try {
            if (idToken == null || idToken.trim().isEmpty()) {
                log.warn("Empty or null Google ID token provided");
                return null;
            }

            // Create GoogleIdTokenVerifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // Verify the token
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            
            if (googleIdToken == null) {
                log.error("Invalid Google ID token");
                return null;
            }
            
            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            
            // Extract user information from the verified token
            GoogleUserInfo userInfo = new GoogleUserInfo();
            userInfo.setGoogleId(payload.getSubject());
            userInfo.setEmail(payload.getEmail());
            userInfo.setName((String) payload.get("name"));
            userInfo.setPictureUrl((String) payload.get("picture"));
            userInfo.setEmailVerified(payload.getEmailVerified());

            log.info("Successfully verified Google token for user: {}", userInfo.getEmail());
            return userInfo;

        } catch (Exception e) {
            log.error("Failed to verify Google ID token", e);
            return null;
        }
    }
}
