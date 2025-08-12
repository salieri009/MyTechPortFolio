package com.mytechfolio.portfolio.security.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;

@Slf4j
@Component
public class JwtUtil {
    
    private final SecretKey secretKey;
    private final long accessTokenValidityInMs;
    private final long refreshTokenValidityInMs;
    
    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-validity-in-ms:3600000}") long accessTokenValidityInMs,
            @Value("${app.jwt.refresh-token-validity-in-ms:86400000}") long refreshTokenValidityInMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValidityInMs = accessTokenValidityInMs;
        this.refreshTokenValidityInMs = refreshTokenValidityInMs;
    }
    
    public String generateAccessToken(Long userId, String email, Set<String> roles) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMs);
        
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("roles", roles)
                .claim("type", "access")
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }
    
    public String generateRefreshToken(Long userId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidityInMs);
        
        return Jwts.builder()
                .subject(userId.toString())
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return Long.valueOf(claims.getSubject());
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return claims.get("email", String.class);
    }
    
    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return (Set<String>) claims.get("roles");
    }
    
    public String getTokenType(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return claims.get("type", String.class);
    }
    
    public long getAccessTokenValidityInMs() {
        return accessTokenValidityInMs;
    }
}
