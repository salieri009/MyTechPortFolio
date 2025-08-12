package com.mytechfolio.portfolio.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "academics")
public class Academic {
    
    @Id
    private String id;
    
    @Field("institution")
    private String institution;
    
    @Field("degree")
    private String degree;
    
    @Field("field_of_study")
    private String fieldOfStudy;
    
    @Field("description")
    private String description;
    
    @Field("start_date")
    private LocalDate startDate;
    
    @Field("end_date")
    private LocalDate endDate;
    
    @Field("grade")
    private String grade;
    
    @Field("activities")
    private String activities;
    
    @Field("location")
    private String location;
    
    @Field("is_current")
    private Boolean isCurrent = false;
    
    @Field("logo_url")
    private String logoUrl;
}
