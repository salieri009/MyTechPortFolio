package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Stores revoked JWTs (logout / refresh rotation) for multi-instance consistency.
 * TTL index on {@code expiresAt} removes rows after natural token expiry.
 */
@Document(collection = "revoked_jwt_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevokedJwtToken {

	@Id
	private String id;

	/**
	 * When the original JWT expires; TTL deletes this document shortly after.
	 */
	@Indexed(expireAfterSeconds = 0)
	private Instant expiresAt;
}
