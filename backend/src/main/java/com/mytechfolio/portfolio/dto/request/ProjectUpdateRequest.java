package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.validation.ValidDateRange;
import com.mytechfolio.portfolio.validation.ValidMongoIdList;
import com.mytechfolio.portfolio.validation.ValidUrl;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange(message = "End date must be after start date")
public class ProjectUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Summary is required")
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 10000, message = "Description must be between 20 and 10000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @ValidUrl(message = "Invalid GitHub URL format", allowEmpty = true)
    private String githubUrl;

    @ValidUrl(message = "Invalid demo URL format", allowEmpty = true)
    private String demoUrl;

    @NotNull(message = "Tech stack IDs are required")
    @ValidMongoIdList(message = "Invalid tech stack IDs", allowEmpty = false, maxSize = 20)
    private List<String> techStackIds;

    @ValidMongoIdList(message = "Invalid academic IDs", allowEmpty = true, maxSize = 10)
    private List<String> academicIds;
}
