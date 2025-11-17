package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.domain.JourneyMilestone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for updating an existing journey milestone.
 * All fields are optional for partial updates.
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyMilestoneUpdateRequest {

    @Size(min = 1, max = 50, message = "Year must be between 1 and 50 characters")
    private String year;

    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    @Size(max = 255, message = "Icon must not exceed 255 characters")
    private String icon;

    private List<String> techStack;

    private JourneyMilestone.MilestoneStatus status;

    @Min(value = 1, message = "Technical complexity must be at least 1")
    @Max(value = 5, message = "Technical complexity must be at most 5")
    private Integer technicalComplexity;

    @Min(value = 0, message = "Project count cannot be negative")
    private Integer projectCount;

    @Valid
    private JourneyMilestoneCreateRequest.CodeMetricsRequest codeMetrics;

    @Valid
    private List<JourneyMilestoneCreateRequest.KeyAchievementRequest> keyAchievements;

    @Valid
    private List<JourneyMilestoneCreateRequest.SkillLevelRequest> skillProgression;
}

