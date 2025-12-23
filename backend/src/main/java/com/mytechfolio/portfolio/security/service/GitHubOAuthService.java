package com.mytechfolio.portfolio.security.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * GitHub OAuth service for token verification and user info retrieval.
 * Uses GitHub API to verify access tokens and retrieve user information.
 */
@Slf4j
@Service
public class GitHubOAuthService {

    private static final String GITHUB_USER_API = "https://api.github.com/user";
    private static final String GITHUB_USER_EMAILS_API = "https://api.github.com/user/emails";

    @Value("${github.oauth.client-id:}")
    private String clientId;

    @Value("${github.oauth.client-secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate;

    public GitHubOAuthService() {
        this.restTemplate = new RestTemplate();
    }

    @Data
    public static class GitHubUserInfo {
        private String githubId;
        private String email;
        private String name;
        private String login; // GitHub username
        private String avatarUrl;
        private boolean emailVerified;
    }

    /**
     * Verify GitHub access token and retrieve user information.
     * 
     * @param accessToken The GitHub OAuth access token
     * @return GitHubUserInfo containing user details, or null if verification fails
     */
    public GitHubUserInfo verifyGitHubToken(String accessToken) {
        try {
            if (accessToken == null || accessToken.trim().isEmpty()) {
                log.warn("Empty or null GitHub access token provided");
                return null;
            }

            // Set up headers with the access token
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", "MyTechPortfolio-App");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // Get user info from GitHub API
            ResponseEntity<GitHubApiUserResponse> response = restTemplate.exchange(
                    GITHUB_USER_API,
                    HttpMethod.GET,
                    entity,
                    GitHubApiUserResponse.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Failed to verify GitHub token: {}", response.getStatusCode());
                return null;
            }

            GitHubApiUserResponse apiResponse = response.getBody();

            // If email is private, try to get it from emails endpoint
            String email = apiResponse.getEmail();
            if (email == null || email.isEmpty()) {
                email = fetchPrimaryEmail(accessToken, headers);
            }

            if (email == null || email.isEmpty()) {
                log.error("Could not retrieve email from GitHub account");
                return null;
            }

            // Build GitHubUserInfo
            GitHubUserInfo userInfo = new GitHubUserInfo();
            userInfo.setGithubId(String.valueOf(apiResponse.getId()));
            userInfo.setEmail(email);
            userInfo.setName(apiResponse.getName() != null ? apiResponse.getName() : apiResponse.getLogin());
            userInfo.setLogin(apiResponse.getLogin());
            userInfo.setAvatarUrl(apiResponse.getAvatarUrl());
            userInfo.setEmailVerified(true); // GitHub emails are verified by GitHub

            log.info("Successfully verified GitHub token for user: {}", userInfo.getEmail());
            return userInfo;

        } catch (Exception e) {
            log.error("Failed to verify GitHub access token", e);
            return null;
        }
    }

    /**
     * Fetch primary email from GitHub emails API (when email is private).
     */
    private String fetchPrimaryEmail(String accessToken, HttpHeaders headers) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<GitHubEmailResponse[]> response = restTemplate.exchange(
                    GITHUB_USER_EMAILS_API,
                    HttpMethod.GET,
                    entity,
                    GitHubEmailResponse[].class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                for (GitHubEmailResponse emailResponse : response.getBody()) {
                    if (emailResponse.isPrimary() && emailResponse.isVerified()) {
                        return emailResponse.getEmail();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch primary email from GitHub emails API", e);
        }
        return null;
    }

    // DTOs for GitHub API responses
    @Data
    private static class GitHubApiUserResponse {
        private Long id;
        private String login;
        private String name;
        private String email;
        private String avatarUrl;
    }

    @Data
    private static class GitHubEmailResponse {
        private String email;
        private boolean primary;
        private boolean verified;
    }
}
