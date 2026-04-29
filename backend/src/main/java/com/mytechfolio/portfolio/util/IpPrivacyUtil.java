package com.mytechfolio.portfolio.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

/**
 * Keyed hash for IP addresses (not reversible without the key; reduces collisions vs String.hashCode).
 */
public final class IpPrivacyUtil {

	private IpPrivacyUtil() {
	}

	public static String hmacSha256Hex(String ipAddress, byte[] key) {
		if (ipAddress == null || ipAddress.isBlank()) {
			return "";
		}
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(key, "HmacSHA256"));
			byte[] out = mac.doFinal(ipAddress.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(out);
		} catch (Exception e) {
			throw new IllegalStateException("HMAC failed", e);
		}
	}
}
