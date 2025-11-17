---
title: "Security Implementation"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "Security Engineers"]
prerequisites: ["../PATTERNS/Security-Patterns.md", "../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["../PATTERNS/Exception-Handling-Patterns.md", "./Deployment-Guide.md"]
maintainer: "Development Team"
---

# Security Implementation Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide explains how to implement and configure security features (JWT authentication, role-based access control, CORS, security headers) in the MyTechPortfolio backend application.

---

## Overview

| Feature | Description |
|---------|-------------|
| Authentication | JWT-based, stateless |
| Authorization | Role-based (`ROLE_ADMIN`, `ROLE_USER`) |
| Transport | HTTPS recommended (HSTS enabled) |
| Headers | Security headers enforced |
| CORS | Configurable whitelist |

---

## 1. Configuration Files

### SecurityConfig

Located at `src/main/java/com/mytechfolio/portfolio/security/config/SecurityConfig.java`.

Key responsibilities:
- Configure stateless JWT authentication
- Define public/protected/admin routes
- Enable security headers
- Register JWT filter

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(SecurityConstants.PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(SecurityConstants.ADMIN_ENDPOINTS).hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .contentTypeOptions(cto -> {})
                .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000).includeSubDomains(true))
                .frameOptions(fo -> fo.deny())
                .referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            .httpBasic(b -> b.disable())
            .formLogin(f -> f.disable())
            .oauth2Login(o -> o.disable());

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### SecurityConstants

Defines public/admin endpoints, JWT settings, password encoder strength.

```java
public final class SecurityConstants {
    public static final String[] PUBLIC_ENDPOINTS = {
        "/api/v1/auth/**",
        "/api/v1/projects/**",
        "/swagger-ui/**",
        "/actuator/health"
    };

    public static final String[] ADMIN_ENDPOINTS = {
        "/api/v1/admin/**"
    };

    public static final int BCRYPT_STRENGTH = 12;
    public static final long JWT_EXPIRATION_MS = 86400000L;
}
```

---

## 2. JWT Authentication

### JwtAuthenticationFilter

Located at `security/filter/JwtAuthenticationFilter.java`. Responsibilities:
- Extract JWT from `Authorization` header
- Validate token via `JwtUtil`
- Populate Spring Security context

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                Claims claims = jwtUtil.parseClaims(token);
                Collection<SimpleGrantedAuthority> authorities = extractAuthorities(claims);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### JwtUtil

Handles token creation/validation. Ensure `JWT_SECRET` environment variable is set in production.

---

## 3. Role-Based Access Control

### HTTP Route Protection

```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers(SecurityConstants.PUBLIC_ENDPOINTS).permitAll()
    .requestMatchers(SecurityConstants.ADMIN_ENDPOINTS).hasRole("ADMIN")
    .anyRequest().authenticated()
)
```

### Method-Level Security

Use `@PreAuthorize` for fine-grained control:

```java
@PreAuthorize("hasRole('ADMIN')")
public ProjectDetailResponse createProject(ProjectCreateRequest request) {
    // ...
}

@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
public ProjectDetailResponse getProject(String id) {
    // ...
}
```

Enable method security via `@EnableMethodSecurity(prePostEnabled = true)` in `SecurityConfig`.

---

## 4. CORS Configuration

Managed via `WebConfig`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(ApiConstants.API_BASE_PATH + "/**")
                .allowedOriginPatterns(allowedOrigins)
                .allowedMethods(allowedMethods)
                .allowedHeaders(allowedHeaders)
                .allowCredentials(allowCredentials)
                .maxAge(maxAge)
                .exposedHeaders("X-Request-ID", "X-Response-Time", "X-Rate-Limit-Remaining");
    }
}
```

Configure via `application.properties`:

```properties
cors.allowed-origins=http://localhost:5173,https://salieri009.studio
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH
cors.allowed-headers=Content-Type,Authorization,X-Requested-With,X-Request-ID
cors.allow-credentials=false
cors.max-age=3600
```

---

## 5. Environment Variables

Set securely in production:

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` for production |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret (min 32 chars) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth credentials |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins |
| `EMAIL_*` | SMTP credentials |

Example (`.env` for local development):
```env
SPRING_PROFILES_ACTIVE=dev
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=local-development-secret-please-change
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> **Never commit production secrets**. Use secret managers or CI/CD variables.

---

## 6. Security Headers

Already configured in `SecurityConfig`. Recommended additional headers (if using reverse proxies like Nginx):

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 7. Security Testing Checklist

- [ ] All public endpoints accessible without token
- [ ] All protected endpoints return `401 Unauthorized` without token
- [ ] Admin endpoints return `403 Forbidden` for non-admin users
- [ ] Tokens expire after configured validity
- [ ] Refresh tokens invalidated when users log out (if implemented)
- [ ] CORS requests only allowed from whitelisted origins
- [ ] Security headers present in responses
- [ ] Sensitive data (passwords, secrets) never logged

---

## Best Practices

1. **Use strong secrets**: `JWT_SECRET` must be long and random
2. **Rotate credentials**: Regularly rotate secrets and keys
3. **Enforce HTTPS**: Deploy behind HTTPS (HSTS enabled)
4. **Least privilege**: Grant minimum required roles/permissions
5. **Audit logs**: Log authentication attempts and admin actions
6. **Validate inputs**: Prevent injection attacks
7. **Monitor dependencies**: Keep security libraries up to date

---

## Related Documentation

- [Security Patterns](../PATTERNS/Security-Patterns.md)
- [Exception Handling Patterns](../PATTERNS/Exception-Handling-Patterns.md)
- [Deployment Guide](./Deployment-Guide.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

