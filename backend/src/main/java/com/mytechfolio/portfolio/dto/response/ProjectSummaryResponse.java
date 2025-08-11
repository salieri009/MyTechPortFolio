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
public class ProjectSummaryResponse {
    private Long id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;

    public static ProjectSummaryResponse from(Project project) {
        return ProjectSummaryResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .summary(project.getSummary())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .techStacks(project.getTechStacks().stream()
                        .map(techStack -> techStack.getName())
                        .collect(Collectors.toList()))
                .build();
    }
}
