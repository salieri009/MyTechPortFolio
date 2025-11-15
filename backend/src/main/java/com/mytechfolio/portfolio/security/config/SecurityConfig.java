package com.mytechfolio.portfolio.security.config;

import com.mytechfolio.portfolio.constants.SecurityConstants;
import com.mytechfolio.portfolio.security.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Security configuration for the application.
 * Configures JWT authentication, CORS, and security headers.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	/**
	 * Configures the security filter chain.
	 * Sets up JWT authentication, public endpoints, and security headers.
	 * 
	 * @param http HttpSecurity instance
	 * @return SecurityFilterChain
	 * @throws Exception if configuration fails
	 */
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
				.contentTypeOptions(cto -> cto.and())
				.httpStrictTransportSecurity(hsts -> hsts
					.maxAgeInSeconds(31536000)
					.includeSubdomains(true)
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
