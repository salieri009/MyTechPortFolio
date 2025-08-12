package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.Academic;

import java.time.LocalDate;
import java.util.List;

public class AcademicResponse {
    private String id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String grade;
    private String activities;
    private String location;
    private Boolean isCurrent;
    private String logoUrl;

    // Constructor
    public AcademicResponse() {}

    public AcademicResponse(String id, String institution, String degree, String fieldOfStudy, String description, 
                           LocalDate startDate, LocalDate endDate, String grade, String activities, 
                           String location, Boolean isCurrent, String logoUrl) {
        this.id = id;
        this.institution = institution;
        this.degree = degree;
        this.fieldOfStudy = fieldOfStudy;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.grade = grade;
        this.activities = activities;
        this.location = location;
        this.isCurrent = isCurrent;
        this.logoUrl = logoUrl;
    }

    // Getters
    public String getId() { return id; }
    public String getDegree() { return degree; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public String getDescription() { return description; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getGrade() { return grade; }
    public String getActivities() { return activities; }
    public String getLocation() { return location; }
    public Boolean getIsCurrent() { return isCurrent; }
    public String getLogoUrl() { return logoUrl; }

    // Builder
    public static AcademicResponseBuilder builder() {
        return new AcademicResponseBuilder();
    }

    public static class AcademicResponseBuilder {
        private String id;
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String grade;
        private String activities;
        private String location;
        private Boolean isCurrent;
        private String logoUrl;

        public AcademicResponseBuilder id(String id) { this.id = id; return this; }
        public AcademicResponseBuilder institution(String institution) { this.institution = institution; return this; }
        public AcademicResponseBuilder degree(String degree) { this.degree = degree; return this; }
        public AcademicResponseBuilder fieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
        public AcademicResponseBuilder description(String description) { this.description = description; return this; }
        public AcademicResponseBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public AcademicResponseBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public AcademicResponseBuilder grade(String grade) { this.grade = grade; return this; }
        public AcademicResponseBuilder activities(String activities) { this.activities = activities; return this; }
        public AcademicResponseBuilder location(String location) { this.location = location; return this; }
        public AcademicResponseBuilder isCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; return this; }
        public AcademicResponseBuilder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }

        public AcademicResponse build() {
            return new AcademicResponse(id, institution, degree, fieldOfStudy, description, startDate, endDate, 
                                      grade, activities, location, isCurrent, logoUrl);
        }
    }

    public static AcademicResponse from(Academic academic) {
        return AcademicResponse.builder()
                .id(academic.getId())
                .institution(academic.getInstitution())
                .degree(academic.getDegree())
                .fieldOfStudy(academic.getFieldOfStudy())
                .description(academic.getDescription())
                .startDate(academic.getStartDate())
                .endDate(academic.getEndDate())
                .grade(academic.getGrade())
                .activities(academic.getActivities())
                .location(academic.getLocation())
                .isCurrent(academic.getIsCurrent())
                .logoUrl(academic.getLogoUrl())
                .build();
    }
}
