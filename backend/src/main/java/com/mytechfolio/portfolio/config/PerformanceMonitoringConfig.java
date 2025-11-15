package com.mytechfolio.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Performance monitoring configuration.
 * Enables performance tracking and metrics collection.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
@EnableScheduling
public class PerformanceMonitoringConfig {
    
    // Performance monitoring beans will be configured here
    // Metrics collection, slow query detection, etc.
}

