package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AcademicUpdateRequest {
    
    @NotBlank(message = "과목명은 필수입니다.")
    @Size(max = 255, message = "과목명은 255자를 초과할 수 없습니다.")
    private String name;
    
    @NotBlank(message = "학기는 필수입니다.")
    @Size(max = 100, message = "학기는 100자를 초과할 수 없습니다.")
    private String semester;
    
    @Size(max = 10, message = "성적은 10자를 초과할 수 없습니다.")
    private String grade;
    
    private String description;
}
