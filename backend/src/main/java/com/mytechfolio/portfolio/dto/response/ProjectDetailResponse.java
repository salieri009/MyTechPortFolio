package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailResponse {
    private Long id;
    private String title;
    private String summary;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private List<String> techStacks;
    private List<String> relatedAcademics;

    public static ProjectDetailResponse from(Project project) {
        return ProjectDetailResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .summary(project.getSummary())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .techStacks(project.getTechStacks().stream()
                        .map(techStack -> techStack.getName())
                        .collect(Collectors.toList()))
                .relatedAcademics(project.getAcademics().stream()
                        .map(academic -> academic.getName())
                        .collect(Collectors.toList()))
                .build();
    }
}
