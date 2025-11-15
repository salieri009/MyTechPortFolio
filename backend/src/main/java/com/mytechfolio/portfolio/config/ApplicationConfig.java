package com.mytechfolio.portfolio.config;

import com.mytechfolio.portfolio.constants.SecurityConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Main application configuration.
 * Configures core beans and application-wide settings.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
@EnableMongoAuditing
public class ApplicationConfig {
    
    @Value("${security.password.encoder.strength:12}")
    private int passwordEncoderStrength;
    
    /**
     * Configures the password encoder bean.
     * Uses BCrypt with configurable strength (default: 12 rounds).
     * Higher strength = more secure but slower.
     * 
     * @return PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        int strength = passwordEncoderStrength > 0 
            ? passwordEncoderStrength 
            : SecurityConstants.BCRYPT_STRENGTH;
        return new BCryptPasswordEncoder(strength);
    }
}
