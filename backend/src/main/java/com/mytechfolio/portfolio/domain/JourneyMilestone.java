package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Journey Milestone domain entity.
 * Represents a milestone in the career journey timeline.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Document(collection = "journey_milestones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyMilestone {

    @Id
    private String id;

    @Indexed
    private String year; // e.g., "2015", "2015~2020"

    @Indexed
    private String title;

    private String description;

    private String icon; // Icon identifier or URL

    @Builder.Default
    private List<String> techStack = new ArrayList<>();

    @Builder.Default
    private MilestoneStatus status = MilestoneStatus.COMPLETED;

    @Builder.Default
    private Integer technicalComplexity = 1; // 1-5

    @Builder.Default
    private Integer projectCount = 0;

    // Optional fields
    private CodeMetrics codeMetrics;

    @Builder.Default
    private List<KeyAchievement> keyAchievements = new ArrayList<>();

    @Builder.Default
    private List<SkillLevel> skillProgression = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum MilestoneStatus {
        COMPLETED, CURRENT, PLANNED
    }

    /**
     * Nested class for code metrics.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeMetrics {
        private Long linesOfCode;
        private Integer commits;
        private Integer repositories;
    }

    /**
     * Nested class for key achievements.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeyAchievement {
        private String title;
        private String description;
        private String impact;
    }

    /**
     * Nested class for skill progression.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillLevel {
        private String name;
        private Integer level; // 1-5
        private SkillCategory category;

        public enum SkillCategory {
            FRONTEND, BACKEND, DATABASE, DEVOPS, OTHER
        }
    }

    // Helper methods
    public boolean isCompleted() {
        return status == MilestoneStatus.COMPLETED;
    }

    public boolean isCurrent() {
        return status == MilestoneStatus.CURRENT;
    }

    public boolean isPlanned() {
        return status == MilestoneStatus.PLANNED;
    }

    public void addTechStack(String tech) {
        if (techStack == null) {
            techStack = new ArrayList<>();
        }
        if (!techStack.contains(tech)) {
            techStack.add(tech);
        }
    }

    public void addKeyAchievement(KeyAchievement achievement) {
        if (keyAchievements == null) {
            keyAchievements = new ArrayList<>();
        }
        keyAchievements.add(achievement);
    }

    public void addSkillLevel(SkillLevel skill) {
        if (skillProgression == null) {
            skillProgression = new ArrayList<>();
        }
        skillProgression.add(skill);
    }
}

