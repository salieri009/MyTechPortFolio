package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * SEO metadata response DTO.
 * Provides structured data for dynamic meta tag generation.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeoMetadataResponse {
    
    // Basic Meta Tags
    private String title;
    private String description;
    private String keywords;
    private String author;
    private String canonicalUrl;
    
    // Open Graph Tags
    private OpenGraph openGraph;
    
    // Twitter Card Tags
    private TwitterCard twitterCard;
    
    // Structured Data (JSON-LD)
    private String structuredData;
    
    // Robots
    private String robots;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpenGraph {
        private String type; // "website", "article", etc.
        private String url;
        private String title;
        private String description;
        private String image;
        private String siteName;
        private String locale;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TwitterCard {
        private String card; // "summary", "summary_large_image"
        private String url;
        private String title;
        private String description;
        private String image;
        private String creator; // @username
    }
}

