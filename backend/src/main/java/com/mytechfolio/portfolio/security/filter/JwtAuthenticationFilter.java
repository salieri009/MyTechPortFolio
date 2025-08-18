package com.mytechfolio.portfolio.security.filter;

import com.mytechfolio.portfolio.security.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			try {
				if (jwtUtil.isTokenValid(token)) {
					Claims claims = jwtUtil.parseClaims(token);
					String subject = claims.getSubject();
					Collection<SimpleGrantedAuthority> authorities = extractAuthorities(claims);
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(subject, null, authorities);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			} catch (Exception e) {
				log.debug("JWT validation failed", e);
			}
		}
		filterChain.doFilter(request, response);
	}

	@SuppressWarnings("unchecked")
	private Collection<SimpleGrantedAuthority> extractAuthorities(Claims claims) {
		List<SimpleGrantedAuthority> result = new ArrayList<>();
		Object rolesObj = claims.get("roles");
		if (rolesObj instanceof List<?> roles) {
			for (Object r : roles) {
				if (r != null) {
					result.add(new SimpleGrantedAuthority(r.toString()));
				}
			}
		}
		Object role = claims.get("role");
		if (role != null) {
			result.add(new SimpleGrantedAuthority(role.toString()));
		}
		return result;
	}
}


