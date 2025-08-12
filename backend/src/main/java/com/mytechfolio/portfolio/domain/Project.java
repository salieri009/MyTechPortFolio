package com.mytechfolio.portfolio.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "summary", nullable = false, length = 500)
    private String summary;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "demo_url")
    private String demoUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_tech_stack",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tech_stack_id")
    )
    private final List<TechStack> techStacks = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_academic",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "academic_id")
    )
    private final List<Academic> academics = new ArrayList<>();

    // Constructors
    public Project() {}

    public Project(Long id, String title, String summary, String description, LocalDate startDate, LocalDate endDate, String githubUrl, String demoUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public String getDescription() { return description; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getGithubUrl() { return githubUrl; }
    public String getDemoUrl() { return demoUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<TechStack> getTechStacks() { return techStacks; }
    public List<Academic> getAcademics() { return academics; }

    // Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public void setTechStacks(List<TechStack> techStacks) {
        this.techStacks.clear();
        this.techStacks.addAll(techStacks);
    }

    public void setAcademics(List<Academic> academics) {
        this.academics.clear();
        this.academics.addAll(academics);
    }

    // Builder
    public static ProjectBuilder builder() {
        return new ProjectBuilder();
    }

    public static class ProjectBuilder {
        private Long id;
        private String title;
        private String summary;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String githubUrl;
        private String demoUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<TechStack> techStacks = new ArrayList<>();
        private List<Academic> academics = new ArrayList<>();

        public ProjectBuilder id(Long id) { this.id = id; return this; }
        public ProjectBuilder title(String title) { this.title = title; return this; }
        public ProjectBuilder summary(String summary) { this.summary = summary; return this; }
        public ProjectBuilder description(String description) { this.description = description; return this; }
        public ProjectBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public ProjectBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public ProjectBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public ProjectBuilder demoUrl(String demoUrl) { this.demoUrl = demoUrl; return this; }
        public ProjectBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProjectBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ProjectBuilder techStacks(List<TechStack> techStacks) { this.techStacks = techStacks; return this; }
        public ProjectBuilder academics(List<Academic> academics) { this.academics = academics; return this; }

        public Project build() {
            Project project = new Project(id, title, summary, description, startDate, endDate, githubUrl, demoUrl, createdAt, updatedAt);
            project.setTechStacks(techStacks);
            project.setAcademics(academics);
            return project;
        }
    }
}
