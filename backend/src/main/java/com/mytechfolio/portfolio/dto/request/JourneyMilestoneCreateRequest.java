package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for creating a new journey milestone.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyMilestoneCreateRequest {

    @NotBlank(message = "Year is required")
    @Size(min = 1, max = 50, message = "Year must be between 1 and 50 characters")
    private String year;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    @Size(max = 255, message = "Icon must not exceed 255 characters")
    private String icon;

    @Builder.Default
    private List<String> techStack = new ArrayList<>();

    @NotNull(message = "Status is required")
    private JourneyMilestone.MilestoneStatus status;

    @Min(value = 1, message = "Technical complexity must be at least 1")
    @Max(value = 5, message = "Technical complexity must be at most 5")
    @Builder.Default
    private Integer technicalComplexity = 1;

    @Min(value = 0, message = "Project count cannot be negative")
    @Builder.Default
    private Integer projectCount = 0;

    @Valid
    private CodeMetricsRequest codeMetrics;

    @Builder.Default
    @Valid
    private List<KeyAchievementRequest> keyAchievements = new ArrayList<>();

    @Builder.Default
    @Valid
    private List<SkillLevelRequest> skillProgression = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeMetricsRequest {
        private Long linesOfCode;
        private Integer commits;
        private Integer repositories;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeyAchievementRequest {
        @NotBlank(message = "Achievement title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        private String title;

        @NotBlank(message = "Achievement description is required")
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        private String description;

        @Size(max = 500, message = "Impact must not exceed 500 characters")
        private String impact;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillLevelRequest {
        @NotBlank(message = "Skill name is required")
        @Size(max = 100, message = "Skill name must not exceed 100 characters")
        private String name;

        @Min(value = 1, message = "Skill level must be at least 1")
        @Max(value = 5, message = "Skill level must be at most 5")
        @NotNull(message = "Skill level is required")
        private Integer level;

        @NotNull(message = "Skill category is required")
        private JourneyMilestone.SkillLevel.SkillCategory category;
    }
}

