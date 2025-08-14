package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Project;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectDetailResponse {
    private String id;
    private String title;
    private String summary;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String githubUrl;
    private String demoUrl;
    private List<String> techStacks;
    private List<String> relatedAcademics;

    public ProjectDetailResponse() {}

    public ProjectDetailResponse(String id, String title, String summary, String description, LocalDate startDate, LocalDate endDate, String githubUrl, String demoUrl, List<String> techStacks, List<String> relatedAcademics) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.techStacks = techStacks;
        this.relatedAcademics = relatedAcademics;
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public String getDescription() { return description; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getGithubUrl() { return githubUrl; }
    public String getDemoUrl() { return demoUrl; }
    public List<String> getTechStacks() { return techStacks; }
    public List<String> getRelatedAcademics() { return relatedAcademics; }

    // Builder
    public static ProjectDetailResponseBuilder builder() {
        return new ProjectDetailResponseBuilder();
    }

    public static class ProjectDetailResponseBuilder {
        private String id;
        private String title;
        private String summary;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String githubUrl;
        private String demoUrl;
        private List<String> techStacks;
        private List<String> relatedAcademics;

        public ProjectDetailResponseBuilder id(String id) { this.id = id; return this; }
        public ProjectDetailResponseBuilder title(String title) { this.title = title; return this; }
        public ProjectDetailResponseBuilder summary(String summary) { this.summary = summary; return this; }
        public ProjectDetailResponseBuilder description(String description) { this.description = description; return this; }
        public ProjectDetailResponseBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public ProjectDetailResponseBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public ProjectDetailResponseBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public ProjectDetailResponseBuilder demoUrl(String demoUrl) { this.demoUrl = demoUrl; return this; }
        public ProjectDetailResponseBuilder techStacks(List<String> techStacks) { this.techStacks = techStacks; return this; }
        public ProjectDetailResponseBuilder relatedAcademics(List<String> relatedAcademics) { this.relatedAcademics = relatedAcademics; return this; }

        public ProjectDetailResponse build() {
            return new ProjectDetailResponse(id, title, summary, description, startDate, endDate, githubUrl, demoUrl, techStacks, relatedAcademics);
        }
    }

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
