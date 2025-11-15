package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AcademicCreateRequest {
    
    @NotBlank(message = "과목명은 필수입니다.")
    @Size(min = 2, max = 255, message = "과목명은 2자 이상 255자 이하여야 합니다.")
    private String name;
    
    @NotBlank(message = "학기는 필수입니다.")
    @Size(min = 3, max = 100, message = "학기는 3자 이상 100자 이하여야 합니다.")
    @Pattern(regexp = "^[0-9]{4}.*", message = "학기는 연도로 시작해야 합니다.")
    private String semester;
    
    @Size(max = 10, message = "성적은 10자를 초과할 수 없습니다.")
    @Pattern(regexp = "^[A-F][+-]?|[0-9]+(\\.?[0-9]+)?|HD|D|C|P|F|W|$", 
             message = "유효하지 않은 성적 형식입니다.")
    private String grade;
    
    @Size(max = 5000, message = "설명은 5000자를 초과할 수 없습니다.")
    private String description;
}
