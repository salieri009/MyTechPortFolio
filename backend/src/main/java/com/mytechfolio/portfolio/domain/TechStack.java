package com.mytechfolio.portfolio.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tech_stack")
public class TechStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private TechType type;

    @Column(name = "logo_url")
    private String logoUrl;

    @ManyToMany(mappedBy = "techStacks", fetch = FetchType.LAZY)
    private final List<Project> projects = new ArrayList<>();

    public enum TechType {
        Backend, Frontend, DB, DevOps, Other
    }

    // Constructors
    public TechStack() {}

    public TechStack(Long id, String name, TechType type, String logoUrl) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.logoUrl = logoUrl;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public TechType getType() { return type; }
    public String getLogoUrl() { return logoUrl; }
    public List<Project> getProjects() { return projects; }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setType(TechType type) {
        this.type = type;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    // Builder
    public static TechStackBuilder builder() {
        return new TechStackBuilder();
    }

    public static class TechStackBuilder {
        private Long id;
        private String name;
        private TechType type;
        private String logoUrl;

        public TechStackBuilder id(Long id) { this.id = id; return this; }
        public TechStackBuilder name(String name) { this.name = name; return this; }
        public TechStackBuilder type(TechType type) { this.type = type; return this; }
        public TechStackBuilder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }

        public TechStack build() {
            return new TechStack(id, name, type, logoUrl);
        }
    }
}
