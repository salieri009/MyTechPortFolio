package com.mytechfolio.portfolio.dto.response;

import java.time.LocalDate;
import java.util.List;

public class ProjectSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;
    private String imageUrl;
    private Boolean isFeatured;

    public ProjectSummaryResponse() {
    }

    public ProjectSummaryResponse(String id, String title, String summary, LocalDate startDate, LocalDate endDate,
            List<String> techStacks, String imageUrl, Boolean isFeatured) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.startDate = startDate;
        this.endDate = endDate;
        this.techStacks = techStacks;
        this.imageUrl = imageUrl;
        this.isFeatured = isFeatured;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public List<String> getTechStacks() {
        return techStacks;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

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
        private String imageUrl;
        private Boolean isFeatured;

        public ProjectSummaryResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public ProjectSummaryResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public ProjectSummaryResponseBuilder summary(String summary) {
            this.summary = summary;
            return this;
        }

        public ProjectSummaryResponseBuilder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public ProjectSummaryResponseBuilder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }

        public ProjectSummaryResponseBuilder techStacks(List<String> techStacks) {
            this.techStacks = techStacks;
            return this;
        }

        public ProjectSummaryResponseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProjectSummaryResponseBuilder isFeatured(Boolean isFeatured) {
            this.isFeatured = isFeatured;
            return this;
        }

        public ProjectSummaryResponse build() {
            return new ProjectSummaryResponse(id, title, summary, startDate, endDate, techStacks, imageUrl, isFeatured);
        }
    }

}
