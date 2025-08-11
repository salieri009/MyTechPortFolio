package com.mytechfolio.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TechStackCreateRequest {
    
    @NotBlank(message = "기술명은 필수입니다.")
    @Size(max = 100, message = "기술명은 100자를 초과할 수 없습니다.")
    private String name;
    
    @NotBlank(message = "기술 타입은 필수입니다.")
    @Size(max = 50, message = "기술 타입은 50자를 초과할 수 없습니다.")
    private String type;
    
    @Size(max = 255, message = "로고 URL은 255자를 초과할 수 없습니다.")
    private String logoUrl;
}
