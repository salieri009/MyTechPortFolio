package com.mytechfolio.portfolio.security.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.access-token-validity-in-ms:3600000}")
	private long accessTokenValidityMs;

	@Value("${app.jwt.refresh-token-validity-in-ms:86400000}")
	private long refreshTokenValidityMs;

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String generateAccessToken(String subjectEmail, Map<String, Object> claims) {
		Instant now = Instant.now();
		return Jwts.builder()
			.subject(subjectEmail)
			.issuedAt(Date.from(now))
			.expiration(Date.from(now.plusMillis(accessTokenValidityMs)))
			.claims(claims)
			.signWith(getSigningKey())
			.compact();
	}

	public String generateRefreshToken(String subjectEmail) {
		Instant now = Instant.now();
		return Jwts.builder()
			.subject(subjectEmail)
			.issuedAt(Date.from(now))
			.expiration(Date.from(now.plusMillis(refreshTokenValidityMs)))
			.signWith(getSigningKey())
			.compact();
	}

	public boolean isTokenValid(String token) {
		try {
			parseClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Claims parseClaims(String token) {
		return Jwts.parser()
			.verifyWith(getSigningKey())
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}
}


