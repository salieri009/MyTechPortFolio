package com.mytechfolio.portfolio.util;

import java.nio.file.Path;
import java.util.regex.Pattern;

/**
 * Guards against path traversal in user-influenced file paths.
 */
public final class PathSecurityUtil {

	private static final Pattern SAFE_SEGMENT = Pattern.compile("^[a-zA-Z0-9._-]+$");

	private PathSecurityUtil() {
	}

	/**
	 * Returns a single path segment safe for use under a controlled base directory.
	 * Rejects empty, "..", separators, and suspicious characters.
	 */
	/**
	 * Builds a relative path from sanitized segments (for storage keys under a base directory).
	 */
	public static String normalizeRelativeStoragePath(String raw) {
		if (raw == null || raw.isBlank()) {
			throw new IllegalArgumentException("Storage path must not be empty");
		}
		String[] parts = raw.replace("\\", "/").split("/");
		StringBuilder sb = new StringBuilder();
		for (String p : parts) {
			if (p == null || p.isEmpty()) {
				continue;
			}
			if (sb.length() > 0) {
				sb.append('/');
			}
			sb.append(sanitizePathSegment(p));
		}
		if (sb.isEmpty()) {
			throw new IllegalArgumentException("Storage path must not be empty");
		}
		return sb.toString();
	}

	public static String sanitizePathSegment(String raw) {
		if (raw == null || raw.isBlank()) {
			return "file";
		}
		String name = Path.of(raw).getFileName().toString();
		if (name.isBlank() || "..".equals(name) || ".".equals(name)) {
			return "file";
		}
		if (!SAFE_SEGMENT.matcher(name).matches()) {
			return "file";
		}
		return name;
	}

	/**
	 * Resolves {@code relative} under {@code base} and ensures the result stays under {@code base}.
	 */
	public static Path resolveUnderBase(Path base, String relative) {
		Path normalizedBase = base.toAbsolutePath().normalize();
		Path candidate = normalizedBase.resolve(relative.replace("\\", "/")).normalize();
		if (!candidate.startsWith(normalizedBase)) {
			throw new IllegalArgumentException("Path escapes base directory");
		}
		return candidate;
	}
}
