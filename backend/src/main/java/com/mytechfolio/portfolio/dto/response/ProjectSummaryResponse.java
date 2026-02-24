package com.mytechfolio.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> techStacks;
    private String imageUrl;
    private Boolean isFeatured;
    private String status;
}
