package com.mytechfolio.portfolio.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "academic")
public class Academic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "semester", nullable = false, length = 100)
    private String semester;

    @Column(name = "grade", length = 10)
    private String grade;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "academics", fetch = FetchType.LAZY)
    private final List<Project> projects = new ArrayList<>();

    // Constructors
    public Academic() {}

    public Academic(Long id, String name, String semester, String grade, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.semester = semester;
        this.grade = grade;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSemester() { return semester; }
    public String getGrade() { return grade; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<Project> getProjects() { return projects; }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public void updateAcademic(String name, String semester, String grade, String description) {
        this.name = name;
        this.semester = semester;
        this.grade = grade;
        this.description = description;
    }

    // Builder
    public static AcademicBuilder builder() {
        return new AcademicBuilder();
    }

    public static class AcademicBuilder {
        private Long id;
        private String name;
        private String semester;
        private String grade;
        private String description;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AcademicBuilder id(Long id) { this.id = id; return this; }
        public AcademicBuilder name(String name) { this.name = name; return this; }
        public AcademicBuilder semester(String semester) { this.semester = semester; return this; }
        public AcademicBuilder grade(String grade) { this.grade = grade; return this; }
        public AcademicBuilder description(String description) { this.description = description; return this; }
        public AcademicBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AcademicBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Academic build() {
            return new Academic(id, name, semester, grade, description, createdAt, updatedAt);
        }
    }
}
