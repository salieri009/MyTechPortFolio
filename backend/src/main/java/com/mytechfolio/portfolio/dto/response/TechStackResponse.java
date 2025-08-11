package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.TechStack;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechStackResponse {
    private Long id;
    private String name;
    private String type;

    public static TechStackResponse from(TechStack techStack) {
        return TechStackResponse.builder()
                .id(techStack.getId())
                .name(techStack.getName())
                .type(techStack.getType().name())
                .build();
    }
}
