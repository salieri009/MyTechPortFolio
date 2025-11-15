package com.mytechfolio.portfolio.dto.response;


public class TechStackResponse {
    private String id;
    private String name;
    private String type;

    public TechStackResponse() {}

    public TechStackResponse(String id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }

    // Builder
    public static TechStackResponseBuilder builder() {
        return new TechStackResponseBuilder();
    }

    public static class TechStackResponseBuilder {
        private String id;
        private String name;
        private String type;

        public TechStackResponseBuilder id(String id) { this.id = id; return this; }
        public TechStackResponseBuilder name(String name) { this.name = name; return this; }
        public TechStackResponseBuilder type(String type) { this.type = type; return this; }

        public TechStackResponse build() {
            return new TechStackResponse(id, name, type);
        }
    }

}
