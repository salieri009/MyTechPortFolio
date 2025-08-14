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

@Document(collection = "academics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Academic {

    @Id
    private String id;

    @Indexed
    private String subjectCode; // "31264", "41025" 등

    private String name; // "Computer Graphics"

    private String semester; // "2025 AUT"

    private AcademicGrade grade; // HIGH_DISTINCTION, DISTINCTION, CREDIT, PASS

    private Integer creditPoints; // 6

    private Integer marks; // 92점

    private String description;

    private AcademicStatus status; // COMPLETED, ENROLLED, EXEMPTION

    private Integer year; // 2024, 2025

    private Semester semesterType; // SPRING, AUTUMN

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum AcademicGrade {
        HIGH_DISTINCTION("HD"), 
        DISTINCTION("D"), 
        CREDIT("C"), 
        PASS("P");

        private final String shortName;

        AcademicGrade(String shortName) {
            this.shortName = shortName;
        }

        public String getShortName() {
            return shortName;
        }

        public static AcademicGrade fromShortName(String shortName) {
            for (AcademicGrade grade : values()) {
                if (grade.shortName.equals(shortName)) {
                    return grade;
                }
            }
            return null;
        }
    }

    public enum AcademicStatus {
        COMPLETED, ENROLLED, EXEMPTION
    }

    public enum Semester {
        SPRING("SPR"), 
        AUTUMN("AUT");

        private final String shortName;

        Semester(String shortName) {
            this.shortName = shortName;
        }

        public String getShortName() {
            return shortName;
        }

        public static Semester fromShortName(String shortName) {
            for (Semester semester : values()) {
                if (semester.shortName.equals(shortName)) {
                    return semester;
                }
            }
            return null;
        }
    }

    // Helper methods
    public boolean isCompleted() {
        return status == AcademicStatus.COMPLETED;
    }

    public boolean isEnrolled() {
        return status == AcademicStatus.ENROLLED;
    }

    public boolean isExemption() {
        return status == AcademicStatus.EXEMPTION;
    }

    public String getFullSemester() {
        return year + " " + (semesterType != null ? semesterType.getShortName() : "");
    }

    public Double getGradePoint() {
        if (grade == null) return null;
        switch (grade) {
            case HIGH_DISTINCTION: return 4.0;
            case DISTINCTION: return 3.0;
            case CREDIT: return 2.0;
            case PASS: return 1.0;
            default: return 0.0;
        }
    }
    
    // Compatibility methods
    public void updateAcademic(String name, String semester, String description, String gradeStr) {
        this.name = name;
        this.semester = semester;
        this.description = description;
        // Note: gradeStr would need to be converted to AcademicGrade enum
    }
    
    public java.util.List<com.mytechfolio.portfolio.domain.Project> getProjects() {
        // Return empty list for now - would need actual relationship mapping
        return new java.util.ArrayList<>();
    }
}
