# Backend Improvement Plan

## Overview

This document catalogs all discrepancies between the planning documents (`docs/`) and the actual backend implementation, along with technical issues discovered during code audit. Each item includes severity, affected files, and the specific improvement required.

**Status: Implementation Complete (P1~P5)**

---

## Category 1: CRITICAL Security Issues

### 1.1 Public CRUD Endpoints (No Authentication) — RESOLVED

**Severity:** CRITICAL
**Spec Reference:** `BACKEND_ARCHITECTURE.md` Section 4.3, `API_PROJECTS.md`, `API_ACADEMICS.md`, `API_TESTIMONIALS.md`

**Changes Applied:**
- `SecurityConstants.java` — Replaced single `PUBLIC_ENDPOINTS` with `INFRASTRUCTURE_ENDPOINTS`, `PUBLIC_GET_ENDPOINTS`, `PUBLIC_POST_ENDPOINTS`
- `SecurityConfig.java` — Updated `filterChain` to use `HttpMethod.GET`/`HttpMethod.POST` matching
- `ProjectController.java` — Added `@PreAuthorize("hasRole('ADMIN')")` to POST/PUT/DELETE
- `TestimonialController.java` — Added `@PreAuthorize("hasRole('ADMIN')")` to POST/PUT/DELETE
- `AcademicController.java` — Already had `@PreAuthorize` (verified)
- `JourneyMilestoneController.java` — Already had `@PreAuthorize` (verified)
- `ProjectMediaController.java` — Already had `@PreAuthorize` (verified)

### 1.2 Hardcoded OAuth Secrets in Source Code — RESOLVED

**Severity:** CRITICAL

**Changes Applied:**
- `application.properties` — Replaced hardcoded Google OAuth credentials with `${GOOGLE_CLIENT_ID:}` and `${GOOGLE_CLIENT_SECRET:}`

### 1.3 Weak JWT Secret Fallback — RESOLVED

**Severity:** HIGH

**Changes Applied:**
- `application.properties` — Changed `${JWT_SECRET:demo-jwt-...}` to `${JWT_SECRET}` (no fallback)

### 1.4 Logout Does Not Invalidate Tokens — RESOLVED

**Severity:** HIGH

**Changes Applied:**
- `AuthService.java` — Added in-memory token blacklist using `ConcurrentHashMap.newKeySet()`
- `AuthService.java` — `logout()` now adds token to blacklist
- `JwtAuthenticationFilter.java` — Added `!authService.isTokenBlacklisted(token)` check

### 1.5 Refresh Token Not Validated Properly — RESOLVED

**Severity:** HIGH

**Changes Applied:**
- `AuthService.java` — Rewrote `refreshToken()` to validate token, check blacklist, verify user exists/enabled, rotate tokens

---

## Category 2: Spec-Implementation JWT/Token Mismatches

### 2.1 JWT Token Validity Mismatch — RESOLVED

**Changes Applied:**
- `application.properties` — `3600000` → `86400000` (access), `86400000` → `604800000` (refresh)
- `JwtUtil.java` — Default values updated to match: `86400000` / `604800000`

### 2.2 LoginResponse.UserInfo.id Type Mismatch — RESOLVED

**Changes Applied:**
- `LoginResponse.java` — Changed `private Long id;` → `private String id;`
- `AuthService.java` — Changed `.id(null)` → `.id(user.getId())`, `expiresIn(3600L)` → `expiresIn(86400L)`

### 2.3 buildLoginResponse Duplicate Line — VERIFIED NOT PRESENT

The reported duplicate `accessToken` line was not found in the actual file. No change needed.

---

## Category 3: N+1 Query Performance Issues

### 3.1 ProjectMapper N+1 Queries — RESOLVED

**Changes Applied:**
- `ProjectMapper.java` — Added `toSummaryResponse(Project, Map<String, String>)` overload using pre-fetched map
- `ProjectService.java` — Added batch fetching: collects all techStackIds, single batch query via `TechStackRepository`, passes map to mapper

### 3.2 ConcurrentMapCacheManager Instead of Caffeine — RESOLVED

**Changes Applied:**
- `build.gradle` — Added `com.github.ben-manes.caffeine:caffeine` dependency
- `CacheConfig.java` — Replaced `ConcurrentMapCacheManager` with `CaffeineCacheManager` (1h TTL, 500 max size)

### 3.3 @Transactional on MongoDB Without Replica Set — RESOLVED

**Changes Applied:**
- `BaseServiceImpl.java` — Removed all `@Transactional` annotations and import

---

## Category 4: Code Quality Improvements

### 4.1 Manual Builders Instead of Lombok — RESOLVED

**Changes Applied:**
- `ProjectDetailResponse.java` — Replaced ~78 lines of manual builder with `@Data @Builder @NoArgsConstructor @AllArgsConstructor`
- `ProjectSummaryResponse.java` — Replaced ~124 lines of manual builder with Lombok annotations

### 4.2 Response DTO Missing Fields — RESOLVED

**Changes Applied:**
- `ProjectDetailResponse.java` — Added `repositoryName`, `isFeatured`, `status`, `viewCount`
- `ProjectSummaryResponse.java` — Added `status`
- `ProjectMapper.java` — Updated all `toResponse()` and `toSummaryResponse()` methods to map new fields

### 4.3 User Entity Duplicate Fields — RESOLVED

**Changes Applied:**
- `User.java` — Removed `name`, `profilePictureUrl`, `lastLogin` fields
- `User.java` — Updated `updateLastLogin()` to use `lastLoginAt`
- `User.java` — Removed compatibility `setLastLoginAt()` method (Lombok generates it)
- `AuthService.java` — Removed all `.name()` and `.setName()` references, using `displayName` only
- `UserRepository.java` — Updated query from `'lastLogin'` to `'lastLoginAt'`

### 4.4 AdminUser Duplicate Methods — RESOLVED

**Changes Applied:**
- `AdminUser.java` — Removed `updateUserInfo()`, `disable()`, `enable()` (kept `updateProfile()`, `deactivate()`, `activate()`)

### 4.5 AdminUser.isActive() Compilation Error — VERIFIED ALREADY CORRECT

The actual file already had the `return` keyword. No change needed.

### 4.6 SQL Injection Detection for MongoDB — RESOLVED

**Changes Applied:**
- `InputSanitizer.java` — Removed `SQL_INJECTION_PATTERN` and `containsSqlInjection()` method. Kept NoSQL-relevant `sanitizeMongoQuery()`

### 4.7 JwtAuthenticationFilter ROLE_ Prefix — RESOLVED

**Changes Applied:**
- `JwtAuthenticationFilter.java` — Fixed `extractAuthorities()` to add `ROLE_` prefix for Spring Security `hasRole()` compatibility

---

## Category 5: Empty Stub Files — RESOLVED

**Changes Applied:**
Deleted 8 empty (0-byte) stub files:
- `security/config/SecurityConfigNew.java`
- `security/dto/AuthResponse.java`
- `security/dto/LoginRequest.java`
- `security/dto/TwoFactorSetupRequest.java`
- `security/entity/Role.java`
- `security/repository/RoleRepository.java`
- `security/service/CustomUserDetailsService.java`
- `security/util/TwoFactorAuthUtil.java`

Deleted 4 empty directories: `security/controller/`, `security/dto/`, `security/entity/`, `security/repository/`

---

## Remaining Items (Deferred — Not in scope for current iteration)

These items were identified during the audit but are feature gaps rather than bugs or spec violations:

| # | Item | Severity | Notes |
|---|------|----------|-------|
| D1 | 2FA Endpoints (API_AUTH.md) | MEDIUM | Full 2FA flow not in current scope |
| D2 | StorageService implementation | MEDIUM | Needs Azure Blob / local file strategy |
| D3 | Rate limiting | MEDIUM | Bucket4j or Caffeine-based counter |
| D4 | AbstractCrudController usage | LOW | Controllers use custom patterns |
| D5 | application.properties vs .yml | LOW | Documentation mismatch only |
| D6 | Contact/Resume/Engagement public endpoints | LOW | May need PUBLIC_POST_ENDPOINTS addition |

---

## Build Verification

All changes compile successfully: `./gradlew compileJava` — **BUILD SUCCESSFUL**
