package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailResponse {
    private String id;
    private String title;
    private String summary;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private String repositoryName;
    private Boolean isFeatured;
    private String status;
    private Long viewCount;
    private List<String> techStacks;
    private List<String> relatedAcademics;
}
