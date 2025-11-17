package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for journey milestone response.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyMilestoneResponse {

    private String id;
    private String year;
    private String title;
    private String description;
    private String icon;
    
    @Builder.Default
    private List<String> techStack = new ArrayList<>();
    
    private JourneyMilestone.MilestoneStatus status;
    private Integer technicalComplexity;
    private Integer projectCount;
    
    private CodeMetricsResponse codeMetrics;
    
    @Builder.Default
    private List<KeyAchievementResponse> keyAchievements = new ArrayList<>();
    
    @Builder.Default
    private List<SkillLevelResponse> skillProgression = new ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeMetricsResponse {
        private Long linesOfCode;
        private Integer commits;
        private Integer repositories;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeyAchievementResponse {
        private String title;
        private String description;
        private String impact;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillLevelResponse {
        private String name;
        private Integer level;
        private JourneyMilestone.SkillLevel.SkillCategory category;
    }
}

