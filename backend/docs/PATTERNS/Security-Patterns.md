---
title: "Security Patterns"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "Security Engineers"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Controller-Patterns.md", "Exception-Handling-Patterns.md"]
maintainer: "Development Team"
---

# Security Patterns

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document describes the patterns and conventions for security implementation in the MyTechPortfolio backend application.

---

## Security Architecture

The application uses **JWT (JSON Web Token)** authentication with Spring Security for:
- Authentication (who you are)
- Authorization (what you can do)
- Role-based access control (RBAC)

---

## Security Configuration

### SecurityConfig Structure

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF disabled for stateless JWT authentication
            .csrf(csrf -> csrf.disable())
            
            // Stateless session management for JWT
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization rules
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(SecurityConstants.PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(SecurityConstants.ADMIN_ENDPOINTS).hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            
            // Security headers
            .headers(headers -> headers
                .contentTypeOptions(cto -> {})
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
                .frameOptions(fo -> fo.deny())
                .referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            
            // Disable default authentication mechanisms
            .httpBasic(b -> b.disable())
            .formLogin(f -> f.disable())
            .oauth2Login(o -> o.disable());

        // Add JWT authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

## JWT Authentication Pattern

### JWT Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Extract token from Authorization header
        String token = extractToken(request);
        
        if (token != null && jwtUtil.validateToken(token)) {
            // Get username from token
            String username = jwtUtil.extractUsername(token);
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Create authentication
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
            
            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

## Endpoint Security Patterns

### Public Endpoints

```java
// In SecurityConfig
.requestMatchers(SecurityConstants.PUBLIC_ENDPOINTS).permitAll()
```

**Public Endpoints** (defined in `SecurityConstants`):
- `/api/v1/auth/**` - Authentication endpoints
- `/api/v1/projects/**` - Public project endpoints
- `/api/v1/academics/**` - Public academic endpoints
- `/swagger-ui/**` - API documentation
- `/actuator/health` - Health check

### Protected Endpoints

```java
// In SecurityConfig
.anyRequest().authenticated()
```

**Pattern**: All endpoints not explicitly public require authentication.

### Admin-Only Endpoints

```java
// In SecurityConfig
.requestMatchers(SecurityConstants.ADMIN_ENDPOINTS).hasRole("ADMIN")
```

**Admin Endpoints**:
- `/api/v1/admin/**` - Admin management endpoints

### Method-Level Security

```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/admin/projects")
public ResponseEntity<...> createProject(@Valid @RequestBody ProjectCreateRequest request) {
    // Only ADMIN can access
}
```

**Annotations**:
- `@PreAuthorize`: Check before method execution
- `@PostAuthorize`: Check after method execution
- `@Secured`: Simple role-based security

---

## Authentication Patterns

### Login Endpoint

```java
@PostMapping("/auth/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    // Authenticate user
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(), 
            request.getPassword()
        )
    );
    
    // Generate JWT token
    String token = jwtUtil.generateToken(authentication.getName());
    
    // Return response
    return ResponseEntity.ok(LoginResponse.builder()
        .token(token)
        .username(authentication.getName())
        .build());
}
```

### Token Generation

```java
public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("username", username);
    
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

### Token Validation

```java
public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

---

## Authorization Patterns

### Role-Based Access Control

```java
// Check role in service
@Service
public class ProjectService {
    
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        // Only ADMIN can create projects
    }
    
    public ProjectDetailResponse getProject(String id) {
        // Public access
    }
}
```

### Permission-Based Access Control

```java
@PreAuthorize("hasAuthority('PROJECT_WRITE')")
public ProjectDetailResponse updateProject(String id, ProjectUpdateRequest request) {
    // Check specific permission
}
```

---

## Security Headers

### Security Headers Configuration

```java
.headers(headers -> headers
    .contentTypeOptions(cto -> {})  // X-Content-Type-Options: nosniff
    .httpStrictTransportSecurity(hsts -> hsts
        .maxAgeInSeconds(31536000)  // 1 year
        .includeSubDomains(true)
    )
    .frameOptions(fo -> fo.deny())  // X-Frame-Options: DENY
    .referrerPolicy(rp -> rp.policy(
        ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
    ))
)
```

**Security Headers**:
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `Strict-Transport-Security` - Force HTTPS
- `X-Frame-Options: DENY` - Prevent clickjacking
- `Referrer-Policy` - Control referrer information

---

## Password Security

### Password Encoding

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(SecurityConstants.BCRYPT_STRENGTH);
}
```

**BCrypt Strength**: 12 rounds (production-ready)

### Password Validation

```java
// In service
private void validatePassword(String password) {
    if (password.length() < 8) {
        throw new IllegalArgumentException("Password must be at least 8 characters");
    }
    // Additional validation rules
}
```

---

## CORS Configuration

### CORS Setup

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
            .allowedOrigins(ApiConstants.DEFAULT_ALLOWED_ORIGINS)
            .allowedMethods(ApiConstants.DEFAULT_ALLOWED_METHODS)
            .allowedHeaders(ApiConstants.DEFAULT_ALLOWED_HEADERS)
            .exposedHeaders("X-Request-ID", "X-Response-Time")
            .allowCredentials(false)
            .maxAge(3600);
    }
}
```

**CORS Settings**:
- Allowed origins: `http://localhost:5173`, `https://salieri009.studio`
- Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- Exposed headers: `X-Request-ID`, `X-Response-Time`

---

## Security Best Practices

### ✅ DO

1. **Use JWT for stateless authentication**: No server-side sessions
2. **Validate tokens**: Always validate JWT tokens
3. **Use HTTPS**: In production, always use HTTPS
4. **Set security headers**: Prevent common attacks
5. **Use strong password encoding**: BCrypt with strength 12+
6. **Implement role-based access**: Use roles and permissions
7. **Log security events**: Log authentication failures, access denials
8. **Validate inputs**: Always validate user inputs
9. **Use constants**: For endpoints, roles, etc.

### ❌ DON'T

1. **Don't store passwords in plain text**: Always hash passwords
2. **Don't expose sensitive data**: In error messages or logs
3. **Don't skip token validation**: Always validate JWT tokens
4. **Don't use weak encryption**: Use strong algorithms
5. **Don't trust client input**: Always validate and sanitize
6. **Don't expose stack traces**: In production error responses
7. **Don't use default credentials**: Change default passwords

---

## Security Constants

### SecurityConstants Class

```java
public final class SecurityConstants {
    
    // Password Encoding
    public static final int BCRYPT_STRENGTH = 12;
    
    // JWT Configuration
    public static final long JWT_EXPIRATION_MS = 86400000L; // 24 hours
    public static final long JWT_REFRESH_EXPIRATION_MS = 604800000L; // 7 days
    
    // Public Endpoints
    public static final String[] PUBLIC_ENDPOINTS = {
        "/api/v1/auth/**",
        "/api/v1/projects/**",
        // ...
    };
    
    // Admin Endpoints
    public static final String[] ADMIN_ENDPOINTS = {
        "/api/v1/admin/**"
    };
}
```

---

## Related Documentation

- [Controller Patterns](./Controller-Patterns.md) - Security in controllers
- [Exception Handling Patterns](./Exception-Handling-Patterns.md) - Security exceptions
- [Architecture Security](../ARCHITECTURE/Security-Architecture.md) - Security architecture

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

