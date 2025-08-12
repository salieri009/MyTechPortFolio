package com.mytechfolio.portfolio.security.config;

import com.mytechfolio.portfolio.security.filter.JwtAuthenticationFilter;
import com.mytechfolio.portfolio.security.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // Disable CSRF for stateless API
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configure session management
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configure authorization
                .authorizeHttpRequests(authz -> authz
                    // Public endpoints
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()
                    .requestMatchers("/api/health").permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                    
                    // Admin endpoints
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    
                    // All other requests require authentication
                    .anyRequest().authenticated()
                )
                
                // Add authentication provider
                .authenticationProvider(authenticationProvider())
                
                // Add JWT filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                
                // Configure security headers
                .headers(headers -> headers
                    .frameOptions().deny()
                    .contentTypeOptions().and()
                    .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                        .maxAgeInSeconds(31536000)
                        .includeSubdomains(true)
                        .preload(true)
                    )
                    .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                    .cacheControl().and()
                    .and()
                    .addHeaderWriter((request, response) -> {
                        response.setHeader("X-Content-Type-Options", "nosniff");
                        response.setHeader("X-Frame-Options", "DENY");
                        response.setHeader("X-XSS-Protection", "1; mode=block");
                        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
                        response.setHeader("Content-Security-Policy", 
                            "default-src 'self'; " +
                            "script-src 'self' 'unsafe-inline' https://apis.google.com; " +
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                            "font-src 'self' https://fonts.gstatic.com; " +
                            "img-src 'self' data: https:; " +
                            "connect-src 'self' https://api.github.com; " +
                            "frame-ancestors 'none'; " +
                            "base-uri 'self'; " +
                            "form-action 'self'");
                        response.setHeader("Permissions-Policy", 
                            "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
                    })
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://*.vercel.app",
            "https://*.netlify.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
