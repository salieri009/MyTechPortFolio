package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Academic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicResponse {
    private Long id;
    private String name;
    private String semester;
    private String grade;
    private String description;
    private List<RelatedProject> relatedProjects;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RelatedProject {
        private Long id;
        private String title;
    }

    public static AcademicResponse from(Academic academic) {
        return AcademicResponse.builder()
                .id(academic.getId())
                .name(academic.getName())
                .semester(academic.getSemester())
                .grade(academic.getGrade())
                .description(academic.getDescription())
                .relatedProjects(academic.getProjects().stream()
                        .map(project -> RelatedProject.builder()
                                .id(project.getId())
                                .title(project.getTitle())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
