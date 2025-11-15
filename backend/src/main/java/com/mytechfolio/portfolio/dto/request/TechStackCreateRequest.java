package com.mytechfolio.portfolio.dto.request;

import com.mytechfolio.portfolio.validation.ValidUrl;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TechStackCreateRequest {
    
    @NotBlank(message = "기술명은 필수입니다.")
    @Size(min = 2, max = 100, message = "기술명은 2자 이상 100자 이하여야 합니다.")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.]+$", 
             message = "기술명은 영문, 숫자, 공백, 하이픈, 언더스코어, 점만 사용할 수 있습니다.")
    private String name;
    
    @NotBlank(message = "기술 타입은 필수입니다.")
    @Size(max = 50, message = "기술 타입은 50자를 초과할 수 없습니다.")
    @Pattern(regexp = "^(Frontend|Backend|Database|DevOps|Mobile|Other)$", 
             message = "기술 타입은 Frontend, Backend, Database, DevOps, Mobile, Other 중 하나여야 합니다.")
    private String type;
    
    @ValidUrl(message = "Invalid logo URL format", allowEmpty = true)
    @Size(max = 500, message = "로고 URL은 500자를 초과할 수 없습니다.")
    private String logoUrl;
}
