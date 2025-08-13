package com.mytechfolio.portfolio.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "tech_stacks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechStack {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name; // "React", "Spring Boot"

    private TechType type; // FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, OTHER

    private String logoUrl; // 기술 로고 이미지 URL

    private String officialUrl; // 공식 웹사이트

    private String description; // 기술에 대한 설명

    @Builder.Default
    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    @Builder.Default
    private Long usageCount = 0L; // 사용된 프로젝트 수

    @Builder.Default
    private Boolean isPrimary = false; // 주력 기술 여부

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum TechType {
        FRONTEND("Frontend"),
        BACKEND("Backend"),
        DATABASE("Database"),
        DEVOPS("DevOps"),
        MOBILE("Mobile"),
        TESTING("Testing"),
        OTHER("Other");

        private final String displayName;

        TechType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum ProficiencyLevel {
        BEGINNER(1, "초급"),
        INTERMEDIATE(2, "중급"),
        ADVANCED(3, "고급"),
        EXPERT(4, "전문가");

        private final int level;
        private final String koreanName;

        ProficiencyLevel(int level, String koreanName) {
            this.level = level;
            this.koreanName = koreanName;
        }

        public int getLevel() {
            return level;
        }

        public String getKoreanName() {
            return koreanName;
        }
    }

    // Helper methods
    public void incrementUsageCount() {
        this.usageCount = (this.usageCount == null ? 0L : this.usageCount) + 1;
    }

    public void decrementUsageCount() {
        if (this.usageCount != null && this.usageCount > 0) {
            this.usageCount--;
        }
    }

    public boolean isPopular() {
        return this.usageCount != null && this.usageCount >= 3;
    }

    public String getProficiencyDisplay() {
        return proficiencyLevel != null ? 
            proficiencyLevel.getKoreanName() + " (Lv." + proficiencyLevel.getLevel() + ")" : 
            "미설정";
    }
}
