package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Project;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;

    public ProjectSummaryResponse() {}

    public ProjectSummaryResponse(String id, String title, String summary, LocalDate startDate, LocalDate endDate, List<String> techStacks) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.startDate = startDate;
        this.endDate = endDate;
        this.techStacks = techStacks;
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public List<String> getTechStacks() { return techStacks; }

    // Builder
    public static ProjectSummaryResponseBuilder builder() {
        return new ProjectSummaryResponseBuilder();
    }

    public static class ProjectSummaryResponseBuilder {
        private String id;
        private String title;
        private String summary;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<String> techStacks;

        public ProjectSummaryResponseBuilder id(String id) { this.id = id; return this; }
        public ProjectSummaryResponseBuilder title(String title) { this.title = title; return this; }
        public ProjectSummaryResponseBuilder summary(String summary) { this.summary = summary; return this; }
        public ProjectSummaryResponseBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public ProjectSummaryResponseBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public ProjectSummaryResponseBuilder techStacks(List<String> techStacks) { this.techStacks = techStacks; return this; }

        public ProjectSummaryResponse build() {
            return new ProjectSummaryResponse(id, title, summary, startDate, endDate, techStacks);
        }
    }

    public static ProjectSummaryResponse from(Project project) {
        return ProjectSummaryResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .summary(project.getSummary())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .techStacks(project.getTechStack())  // Project 도메인에서 직접 List<String> 반환
                .build();
    }
}
