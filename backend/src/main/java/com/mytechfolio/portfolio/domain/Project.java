package com.mytechfolio.portfolio.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {
    
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("summary")
    private String summary;
    
    @Field("tech_stack")
    private List<String> techStack;
    
    @Field("image_url")
    private String imageUrl;
    
    @Field("github_url")
    private String githubUrl;
    
    @Field("demo_url")
    private String demoUrl;
    
    @Field("start_date")
    private LocalDate startDate;
    
    @Field("end_date")
    private LocalDate endDate;
    
    @Field("featured")
    private Boolean featured = false;
    
    @Field("category")
    private String category;
    
    @Field("status")
    private ProjectStatus status = ProjectStatus.COMPLETED;
    
    public enum ProjectStatus {
        IN_PROGRESS,
        COMPLETED,
        ON_HOLD,
        CANCELLED
    }
}
