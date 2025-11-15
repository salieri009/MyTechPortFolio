package com.mytechfolio.portfolio.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration for improving performance.
 * Uses in-memory caching for frequently accessed data.
 * 
 * Note: For production, consider using Redis or Caffeine.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Configures cache manager.
     * Cache names:
     * - techStacks: Technology stack list (rarely changes)
     * - projects: Project summaries (can be cached for a short time)
     * 
     * @return CacheManager instance
     */
    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "techStacks",
            "projects",
            "academics"
        ));
        return cacheManager;
    }
}

