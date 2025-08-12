package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Academic;

import java.util.List;
import java.util.stream.Collectors;

public class AcademicResponse {
    private Long id;
    private String name;
    private String semester;
    private String grade;
    private String description;
    private List<RelatedProject> relatedProjects;

    // Constructor
    public AcademicResponse() {}

    public AcademicResponse(Long id, String name, String semester, String grade, String description, List<RelatedProject> relatedProjects) {
        this.id = id;
        this.name = name;
        this.semester = semester;
        this.grade = grade;
        this.description = description;
        this.relatedProjects = relatedProjects;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSemester() { return semester; }
    public String getGrade() { return grade; }
    public String getDescription() { return description; }
    public List<RelatedProject> getRelatedProjects() { return relatedProjects; }

    // Builder
    public static AcademicResponseBuilder builder() {
        return new AcademicResponseBuilder();
    }

    public static class AcademicResponseBuilder {
        private Long id;
        private String name;
        private String semester;
        private String grade;
        private String description;
        private List<RelatedProject> relatedProjects;

        public AcademicResponseBuilder id(Long id) { this.id = id; return this; }
        public AcademicResponseBuilder name(String name) { this.name = name; return this; }
        public AcademicResponseBuilder semester(String semester) { this.semester = semester; return this; }
        public AcademicResponseBuilder grade(String grade) { this.grade = grade; return this; }
        public AcademicResponseBuilder description(String description) { this.description = description; return this; }
        public AcademicResponseBuilder relatedProjects(List<RelatedProject> relatedProjects) { this.relatedProjects = relatedProjects; return this; }

        public AcademicResponse build() {
            return new AcademicResponse(id, name, semester, grade, description, relatedProjects);
        }
    }

    public static class RelatedProject {
        private Long id;
        private String title;

        public RelatedProject() {}

        public RelatedProject(Long id, String title) {
            this.id = id;
            this.title = title;
        }

        // Getters
        public Long getId() { return id; }
        public String getTitle() { return title; }

        // Builder
        public static RelatedProjectBuilder builder() {
            return new RelatedProjectBuilder();
        }

        public static class RelatedProjectBuilder {
            private Long id;
            private String title;

            public RelatedProjectBuilder id(Long id) { this.id = id; return this; }
            public RelatedProjectBuilder title(String title) { this.title = title; return this; }

            public RelatedProject build() {
                return new RelatedProject(id, title);
            }
        }
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
