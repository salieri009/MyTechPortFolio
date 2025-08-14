package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    private String id;

    private String title;

    private String summary;

    private String description; // Markdown 지원

    private LocalDate startDate;

    private LocalDate endDate;

    private String githubUrl;

    private String demoUrl;

    private String repositoryName; // GitHub 레포 이름

    @Builder.Default
    private Boolean isFeatured = false; // 메인 페이지 노출 여부

    @Builder.Default
    private ProjectStatus status = ProjectStatus.COMPLETED;

    @Builder.Default
    private Long viewCount = 0L;

    // 기술 스택 ID 목록 (MongoDB에서는 문자열 배열로 저장)
    @Builder.Default
    private List<String> techStackIds = new ArrayList<>();

    // 관련 학업 ID 목록
    @Builder.Default
    private List<String> relatedAcademicIds = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ProjectStatus {
        PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED
    }

    // Helper methods
    public void addTechStack(String techStackId) {
        if (this.techStackIds == null) {
            this.techStackIds = new ArrayList<>();
        }
        if (!this.techStackIds.contains(techStackId)) {
            this.techStackIds.add(techStackId);
        }
    }

    public void addRelatedAcademic(String academicId) {
        if (this.relatedAcademicIds == null) {
            this.relatedAcademicIds = new ArrayList<>();
        }
        if (!this.relatedAcademicIds.contains(academicId)) {
            this.relatedAcademicIds.add(academicId);
        }
    }

    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null ? 0L : this.viewCount) + 1;
    }

    public boolean isActive() {
        return status != ProjectStatus.ARCHIVED;
    }
    
    // Compatibility methods for relationships
    public java.util.List<com.mytechfolio.portfolio.domain.TechStack> getTechStacks() {
        // Return empty list for now - would need actual relationship mapping
        return new java.util.ArrayList<>();
    }
    
    public java.util.List<com.mytechfolio.portfolio.domain.Academic> getAcademics() {
        // Return empty list for now - would need actual relationship mapping
        return new java.util.ArrayList<>();
    }
    
    public void setTechStacks(java.util.List<com.mytechfolio.portfolio.domain.TechStack> techStacks) {
        // Convert to ID list for MongoDB storage
        this.techStackIds = techStacks.stream()
                .map(ts -> ts.getId())
                .collect(java.util.stream.Collectors.toList());
    }
    
    public void setAcademics(java.util.List<com.mytechfolio.portfolio.domain.Academic> academics) {
        // Convert to ID list for MongoDB storage
        this.relatedAcademicIds = academics.stream()
                .map(ac -> ac.getId())
                .collect(java.util.stream.Collectors.toList());
    }
}
