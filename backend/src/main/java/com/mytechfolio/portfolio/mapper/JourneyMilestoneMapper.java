package com.mytechfolio.portfolio.mapper;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneCreateRequest;
import com.mytechfolio.portfolio.dto.request.JourneyMilestoneUpdateRequest;
import com.mytechfolio.portfolio.dto.response.JourneyMilestoneResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Mapper for Journey Milestone entity conversions.
 * Handles JourneyMilestone <-> DTO conversions.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Component
public class JourneyMilestoneMapper extends EntityMapper<JourneyMilestone, JourneyMilestoneResponse, JourneyMilestoneCreateRequest, JourneyMilestoneUpdateRequest> {

    @Override
    public JourneyMilestoneResponse toResponse(JourneyMilestone milestone) {
        if (milestone == null) {
            return null;
        }

        return JourneyMilestoneResponse.builder()
                .id(milestone.getId())
                .year(milestone.getYear())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .icon(milestone.getIcon())
                .techStack(milestone.getTechStack() != null ? milestone.getTechStack() : java.util.Collections.emptyList())
                .status(milestone.getStatus())
                .technicalComplexity(milestone.getTechnicalComplexity())
                .projectCount(milestone.getProjectCount())
                .codeMetrics(milestone.getCodeMetrics() != null ? toCodeMetricsResponse(milestone.getCodeMetrics()) : null)
                .keyAchievements(milestone.getKeyAchievements() != null 
                    ? milestone.getKeyAchievements().stream()
                        .map(this::toKeyAchievementResponse)
                        .collect(Collectors.toList())
                    : java.util.Collections.emptyList())
                .skillProgression(milestone.getSkillProgression() != null
                    ? milestone.getSkillProgression().stream()
                        .map(this::toSkillLevelResponse)
                        .collect(Collectors.toList())
                    : java.util.Collections.emptyList())
                .createdAt(milestone.getCreatedAt())
                .updatedAt(milestone.getUpdatedAt())
                .build();
    }

    @Override
    public JourneyMilestone toEntity(JourneyMilestoneCreateRequest createRequest) {
        if (createRequest == null) {
            return null;
        }

        JourneyMilestone.JourneyMilestoneBuilder builder = JourneyMilestone.builder()
                .year(createRequest.getYear())
                .title(createRequest.getTitle())
                .description(createRequest.getDescription())
                .icon(createRequest.getIcon())
                .techStack(createRequest.getTechStack() != null ? createRequest.getTechStack() : new java.util.ArrayList<>())
                .status(createRequest.getStatus())
                .technicalComplexity(createRequest.getTechnicalComplexity() != null ? createRequest.getTechnicalComplexity() : 1)
                .projectCount(createRequest.getProjectCount() != null ? createRequest.getProjectCount() : 0);

        if (createRequest.getCodeMetrics() != null) {
            builder.codeMetrics(toCodeMetrics(createRequest.getCodeMetrics()));
        }

        if (createRequest.getKeyAchievements() != null) {
            builder.keyAchievements(createRequest.getKeyAchievements().stream()
                    .map(this::toKeyAchievement)
                    .collect(Collectors.toList()));
        }

        if (createRequest.getSkillProgression() != null) {
            builder.skillProgression(createRequest.getSkillProgression().stream()
                    .map(this::toSkillLevel)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    @Override
    public void updateEntity(JourneyMilestone entity, JourneyMilestoneUpdateRequest updateRequest) {
        if (entity == null || updateRequest == null) {
            return;
        }

        if (updateRequest.getYear() != null) {
            entity.setYear(updateRequest.getYear());
        }
        if (updateRequest.getTitle() != null) {
            entity.setTitle(updateRequest.getTitle());
        }
        if (updateRequest.getDescription() != null) {
            entity.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getIcon() != null) {
            entity.setIcon(updateRequest.getIcon());
        }
        if (updateRequest.getTechStack() != null) {
            entity.setTechStack(updateRequest.getTechStack());
        }
        if (updateRequest.getStatus() != null) {
            entity.setStatus(updateRequest.getStatus());
        }
        if (updateRequest.getTechnicalComplexity() != null) {
            entity.setTechnicalComplexity(updateRequest.getTechnicalComplexity());
        }
        if (updateRequest.getProjectCount() != null) {
            entity.setProjectCount(updateRequest.getProjectCount());
        }
        if (updateRequest.getCodeMetrics() != null) {
            entity.setCodeMetrics(toCodeMetrics(updateRequest.getCodeMetrics()));
        }
        if (updateRequest.getKeyAchievements() != null) {
            entity.setKeyAchievements(updateRequest.getKeyAchievements().stream()
                    .map(this::toKeyAchievement)
                    .collect(Collectors.toList()));
        }
        if (updateRequest.getSkillProgression() != null) {
            entity.setSkillProgression(updateRequest.getSkillProgression().stream()
                    .map(this::toSkillLevel)
                    .collect(Collectors.toList()));
        }
    }

    // Helper methods for nested objects
    private JourneyMilestoneResponse.CodeMetricsResponse toCodeMetricsResponse(JourneyMilestone.CodeMetrics codeMetrics) {
        return JourneyMilestoneResponse.CodeMetricsResponse.builder()
                .linesOfCode(codeMetrics.getLinesOfCode())
                .commits(codeMetrics.getCommits())
                .repositories(codeMetrics.getRepositories())
                .build();
    }

    private JourneyMilestone.CodeMetrics toCodeMetrics(JourneyMilestoneCreateRequest.CodeMetricsRequest request) {
        return JourneyMilestone.CodeMetrics.builder()
                .linesOfCode(request.getLinesOfCode())
                .commits(request.getCommits())
                .repositories(request.getRepositories())
                .build();
    }

    private JourneyMilestoneResponse.KeyAchievementResponse toKeyAchievementResponse(JourneyMilestone.KeyAchievement achievement) {
        return JourneyMilestoneResponse.KeyAchievementResponse.builder()
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .impact(achievement.getImpact())
                .build();
    }

    private JourneyMilestone.KeyAchievement toKeyAchievement(JourneyMilestoneCreateRequest.KeyAchievementRequest request) {
        return JourneyMilestone.KeyAchievement.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .impact(request.getImpact())
                .build();
    }

    private JourneyMilestoneResponse.SkillLevelResponse toSkillLevelResponse(JourneyMilestone.SkillLevel skill) {
        return JourneyMilestoneResponse.SkillLevelResponse.builder()
                .name(skill.getName())
                .level(skill.getLevel())
                .category(skill.getCategory())
                .build();
    }

    private JourneyMilestone.SkillLevel toSkillLevel(JourneyMilestoneCreateRequest.SkillLevelRequest request) {
        return JourneyMilestone.SkillLevel.builder()
                .name(request.getName())
                .level(request.getLevel())
                .category(request.getCategory())
                .build();
    }
}

