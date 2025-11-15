package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechStackResponse {
    private String id;
    private String name;
    private String type;
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private Integer proficiencyLevelValue; // 1-4 for sorting
    private String proficiencyDisplay; // "중급 (Lv.2)"
    private Long usageCount;
    private Boolean isPrimary;
    private String logoUrl;
    private String officialUrl;
    private String description;
}
