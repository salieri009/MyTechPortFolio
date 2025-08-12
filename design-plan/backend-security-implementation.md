# 🔐 Backend Security Implementation Guide

## Overview
Google OAuth + JWT + 2FA 시스템의 백엔드 보안 구현을 위한 상세 가이드입니다.

---

## 🛡️ 1. Spring Security Configuration

### 1.1 Core Security Configuration
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@EnableJpaAuditing
public class SecurityConfig {
    
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtUtil jwtUtil;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // Dev only
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Blog endpoints - GET public, CRUD admin only
                .requestMatchers(HttpMethod.GET, "/api/blog/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/blog/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/blog/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/blog/**").hasRole("ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated())
            
            // JWT filter
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class)
            
            // Exception handling
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler))
            
            // Security headers
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true))
                .and())
            
            .build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService());
    }
    
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService(userRepository);
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strong encryption
    }
}
```

### 1.2 JWT Authentication Filter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        try {
            String token = extractTokenFromRequest(request);
            
            if (token != null && jwtUtil.validateToken(token)) {
                String tokenType = jwtUtil.getTokenType(token);
                
                // Only accept access tokens for authentication
                if ("access".equals(tokenType)) {
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId.toString());
                    
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        
                        authentication.setDetails(new WebAuthenticationDetailsSource()
                            .buildDetails(request));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        // Add security context to MDC for logging
                        MDC.put("userId", userId.toString());
                        MDC.put("userEmail", jwtUtil.getEmailFromToken(token));
                    }
                }
            }
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/") ||
               path.startsWith("/h2-console/") ||
               path.startsWith("/swagger-ui/");
    }
}
```

---

## 🔒 2. Enhanced Authentication Service

### 2.1 Complete AuthService Implementation
```java
@Service
@Transactional
public class AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final GoogleOAuthService googleOAuthService;
    private final TwoFactorAuthUtil twoFactorAuthUtil;
    private final JwtUtil jwtUtil;
    private final SecurityEventService securityEventService;
    
    public AuthResponse authenticateWithGoogle(LoginRequest loginRequest) {
        try {
            // Verify Google token
            GoogleOAuthService.GoogleUserInfo googleUserInfo = 
                googleOAuthService.verifyGoogleToken(loginRequest.getGoogleIdToken());
            
            if (googleUserInfo == null) {
                throw new AuthenticationException("Invalid Google token");
            }
            
            // Find or create user
            User user = findOrCreateUser(googleUserInfo);
            
            // Check if 2FA is required
            if (user.isTwoFactorEnabled()) {
                if (loginRequest.getTwoFactorCode() == null) {
                    return AuthResponse.builder()
                        .requiresTwoFactor(true)
                        .twoFactorEnabled(true)
                        .message("2FA code required")
                        .build();
                }
                
                // Verify 2FA code
                if (!twoFactorAuthUtil.verifyCode(user.getTwoFactorSecret(), 
                                                 loginRequest.getTwoFactorCode())) {
                    securityEventService.logFailedTwoFactorAttempt(user.getId());
                    throw new AuthenticationException("Invalid 2FA code");
                }
            }
            
            // Update last login
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate tokens
            Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
            
            String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), roles);
            String refreshToken = jwtUtil.generateRefreshToken(user.getId());
            
            // Log successful authentication
            securityEventService.logSuccessfulLogin(user.getId(), googleUserInfo.getEmail());
            
            return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessTokenValidityInMs())
                .userInfo(buildUserInfo(user))
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .message("Authentication successful")
                .build();
                
        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            throw new AuthenticationException("Authentication failed: " + e.getMessage());
        }
    }
    
    public AuthResponse.TwoFactorSetup setupTwoFactor(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if (user.isTwoFactorEnabled()) {
            throw new IllegalStateException("2FA is already enabled");
        }
        
        String secret = twoFactorAuthUtil.generateSecret();
        String qrCodeDataUri = twoFactorAuthUtil.generateQrCodeDataUri(user.getEmail(), secret);
        
        // Store temporary secret (will be permanent when enabled)
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
        
        securityEventService.logTwoFactorSetupInitiated(userId);
        
        return AuthResponse.TwoFactorSetup.builder()
            .secret(secret)
            .qrCodeDataUri(qrCodeDataUri)
            .build();
    }
    
    public AuthResponse enableTwoFactor(Long userId, TwoFactorSetupRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if (user.isTwoFactorEnabled()) {
            throw new IllegalStateException("2FA is already enabled");
        }
        
        // Verify the setup code
        if (!twoFactorAuthUtil.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            securityEventService.logFailedTwoFactorSetup(userId);
            throw new AuthenticationException("Invalid 2FA code");
        }
        
        // Enable 2FA
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
        
        // Generate new tokens
        Set<String> roles = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());
        
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        securityEventService.logTwoFactorEnabled(userId);
        
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .expiresIn(jwtUtil.getAccessTokenValidityInMs())
            .userInfo(buildUserInfo(user))
            .twoFactorEnabled(true)
            .message("2FA enabled successfully")
            .build();
    }
    
    private User findOrCreateUser(GoogleOAuthService.GoogleUserInfo googleUserInfo) {
        return userRepository.findByGoogleId(googleUserInfo.getGoogleId())
            .orElseGet(() -> createNewUser(googleUserInfo));
    }
    
    private User createNewUser(GoogleOAuthService.GoogleUserInfo googleUserInfo) {
        User user = new User();
        user.setEmail(googleUserInfo.getEmail());
        user.setName(googleUserInfo.getName());
        user.setGoogleId(googleUserInfo.getGoogleId());
        user.setPictureUrl(googleUserInfo.getPictureUrl());
        user.setEmailVerified(googleUserInfo.isEmailVerified());
        
        // Assign default USER role
        Role userRole = roleRepository.findByName("USER")
            .orElseThrow(() -> new RuntimeException("Default USER role not found"));
        user.getRoles().add(userRole);
        
        securityEventService.logUserRegistration(googleUserInfo.getEmail());
        
        return userRepository.save(user);
    }
    
    private AuthResponse.UserInfo buildUserInfo(User user) {
        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());
        
        return AuthResponse.UserInfo.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .pictureUrl(user.getPictureUrl())
            .roles(roleNames)
            .isAdmin(user.isAdmin())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
```

---

## 📊 3. Security Event Logging

### 3.1 Security Events Entity
```java
@Entity
@Table(name = "security_events")
public class SecurityEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "event_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SecurityEventType eventType;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;
    
    @Column(name = "risk_level")
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors
}

enum SecurityEventType {
    LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
    TWO_FACTOR_SETUP, TWO_FACTOR_ENABLED, TWO_FACTOR_FAILED,
    USER_REGISTRATION, PASSWORD_CHANGE,
    SUSPICIOUS_ACTIVITY, RATE_LIMIT_EXCEEDED,
    UNAUTHORIZED_ACCESS_ATTEMPT
}

enum RiskLevel {
    LOW, MEDIUM, HIGH, CRITICAL
}
```

### 3.2 Security Event Service
```java
@Service
public class SecurityEventService {
    
    private final SecurityEventRepository securityEventRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    public void logSuccessfulLogin(Long userId, String email) {
        SecurityEvent event = createEvent(userId, SecurityEventType.LOGIN_SUCCESS, RiskLevel.LOW)
            .details("User logged in successfully: " + email);
        securityEventRepository.save(event);
    }
    
    public void logFailedTwoFactorAttempt(Long userId) {
        SecurityEvent event = createEvent(userId, SecurityEventType.TWO_FACTOR_FAILED, RiskLevel.MEDIUM)
            .details("Failed 2FA verification attempt");
        securityEventRepository.save(event);
        
        // Check for multiple failed attempts
        long recentFailures = countRecentFailedAttempts(userId, Duration.ofMinutes(15));
        if (recentFailures >= 3) {
            logSuspiciousActivity(userId, "Multiple failed 2FA attempts: " + recentFailures);
        }
    }
    
    public void logSuspiciousActivity(Long userId, String details) {
        SecurityEvent event = createEvent(userId, SecurityEventType.SUSPICIOUS_ACTIVITY, RiskLevel.HIGH)
            .details(details);
        securityEventRepository.save(event);
        
        // Publish event for real-time alerting
        eventPublisher.publishEvent(new SuspiciousActivityEvent(userId, details));
    }
    
    private SecurityEvent createEvent(Long userId, SecurityEventType eventType, RiskLevel riskLevel) {
        HttpServletRequest request = getCurrentRequest();
        
        SecurityEvent event = new SecurityEvent();
        event.setUserId(userId);
        event.setEventType(eventType);
        event.setRiskLevel(riskLevel);
        
        if (request != null) {
            event.setIpAddress(getClientIpAddress(request));
            event.setUserAgent(request.getHeader("User-Agent"));
        }
        
        return event;
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
```

---

## ⚡ 4. Rate Limiting Implementation

### 4.1 Redis-based Rate Limiter
```java
@Component
public class RateLimitingAspect {
    
    private final RedisTemplate<String, String> redisTemplate;
    private static final String RATE_LIMIT_PREFIX = "rate_limit:";
    
    @Around("@annotation(rateLimit)")
    public Object rateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        HttpServletRequest request = getCurrentRequest();
        if (request == null) {
            return joinPoint.proceed();
        }
        
        String key = buildRateLimitKey(request, rateLimit.keyType());
        String limitKey = RATE_LIMIT_PREFIX + key;
        
        String currentRequests = redisTemplate.opsForValue().get(limitKey);
        
        if (currentRequests == null) {
            redisTemplate.opsForValue().set(limitKey, "1", 
                Duration.ofSeconds(rateLimit.windowSeconds()));
        } else {
            int requests = Integer.parseInt(currentRequests);
            if (requests >= rateLimit.maxRequests()) {
                throw new RateLimitExceededException(
                    "Rate limit exceeded: " + requests + " requests in " + 
                    rateLimit.windowSeconds() + " seconds");
            }
            redisTemplate.opsForValue().increment(limitKey);
        }
        
        return joinPoint.proceed();
    }
    
    private String buildRateLimitKey(HttpServletRequest request, RateLimitKeyType keyType) {
        return switch (keyType) {
            case IP_ADDRESS -> getClientIpAddress(request);
            case USER_ID -> getCurrentUserId();
            case ENDPOINT -> request.getRequestURI();
            case IP_AND_ENDPOINT -> getClientIpAddress(request) + ":" + request.getRequestURI();
        };
    }
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    int maxRequests() default 60;
    int windowSeconds() default 60;
    RateLimitKeyType keyType() default RateLimitKeyType.IP_ADDRESS;
    String message() default "Rate limit exceeded";
}

enum RateLimitKeyType {
    IP_ADDRESS, USER_ID, ENDPOINT, IP_AND_ENDPOINT
}
```

### 4.2 Apply Rate Limiting to Controllers
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/google")
    @RateLimit(maxRequests = 5, windowSeconds = 300, keyType = RateLimitKeyType.IP_ADDRESS)
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody LoginRequest loginRequest) {
        // Implementation
    }
    
    @PostMapping("/2fa/setup")
    @RateLimit(maxRequests = 3, windowSeconds = 3600, keyType = RateLimitKeyType.USER_ID)
    public ResponseEntity<ApiResponse<AuthResponse.TwoFactorSetup>> setupTwoFactor() {
        // Implementation
    }
}
```

---

## 🔐 5. Additional Security Measures

### 5.1 Security Configuration Properties
```yaml
# application-security.yml
app:
  security:
    jwt:
      secret: ${JWT_SECRET:#{T(java.util.UUID).randomUUID().toString().replace('-', '') + T(java.util.UUID).randomUUID().toString().replace('-', '')}}
      access-token-validity: PT1H
      refresh-token-validity: P1D
      algorithm: HS512
    
    rate-limiting:
      enabled: true
      redis:
        host: ${REDIS_HOST:localhost}
        port: ${REDIS_PORT:6379}
    
    cors:
      allowed-origins:
        - http://localhost:3000
        - http://localhost:5173
        - http://localhost:5174
      allowed-methods:
        - GET
        - POST
        - PUT
        - DELETE
        - OPTIONS
      max-age: 3600
    
    headers:
      hsts:
        max-age: 31536000
        include-subdomains: true
      frame-options: DENY
      content-type-options: true
      xss-protection: true
```

### 5.2 Custom Exception Handlers
```java
@ControllerAdvice
public class SecurityExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(SecurityExceptionHandler.class);
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<String>> handleAuthenticationException(
            AuthenticationException e, HttpServletRequest request) {
        
        log.warn("Authentication failed from IP {}: {}", 
            getClientIpAddress(request), e.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.error("Authentication failed"));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDeniedException(
            AccessDeniedException e, HttpServletRequest request) {
        
        log.warn("Access denied for IP {}: {}", 
            getClientIpAddress(request), e.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error("Access denied"));
    }
    
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiResponse<String>> handleRateLimitExceededException(
            RateLimitExceededException e, HttpServletRequest request) {
        
        log.warn("Rate limit exceeded from IP {}: {}", 
            getClientIpAddress(request), e.getMessage());
        
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body(ApiResponse.error("Too many requests"));
    }
}
```

---

*이 가이드는 프로덕션 환경에서의 보안 요구사항을 충족하도록 설계되었습니다.*
