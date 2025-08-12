package com.mytechfolio.portfolio.dto.response;

import com.mytechfolio.portfolio.domain.TechStack;

public class TechStackResponse {
    private Long id;
    private String name;
    private String type;

    public TechStackResponse() {}

    public TechStackResponse(Long id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }

    // Builder
    public static TechStackResponseBuilder builder() {
        return new TechStackResponseBuilder();
    }

    public static class TechStackResponseBuilder {
        private Long id;
        private String name;
        private String type;

        public TechStackResponseBuilder id(Long id) { this.id = id; return this; }
        public TechStackResponseBuilder name(String name) { this.name = name; return this; }
        public TechStackResponseBuilder type(String type) { this.type = type; return this; }

        public TechStackResponse build() {
            return new TechStackResponse(id, name, type);
        }
    }

    public static TechStackResponse from(TechStack techStack) {
        return TechStackResponse.builder()
                .id(techStack.getId())
                .name(techStack.getName())
                .type(techStack.getType().name())
                .build();
    }
}
