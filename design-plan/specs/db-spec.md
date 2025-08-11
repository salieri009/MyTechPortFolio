# Database Specification (MySQL)

## Entities
- project(id PK, title, summary, description, start_date, end_date, github_url, demo_url, created_at, updated_at)
- academic(id PK, name, semester, grade, description, created_at, updated_at)
- tech_stack(id PK, name UNIQUE, type, logo_url)
- project_academic(project_id FK->project.id, academic_id FK->academic.id, PK(project_id, academic_id))
- project_tech_stack(project_id FK->project.id, tech_stack_id FK->tech_stack.id, PK(project_id, tech_stack_id))

## Indexes
- project(end_date DESC), project(title)
- academic(semester)
- tech_stack(type, name)

## Constraints
- Dates: start_date <= end_date
- Cascades: on delete project → cascade to mapping tables; do not cascade delete to academics/tech_stack rows

## Example DDL (compressed)
```
CREATE TABLE project (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  description MEDIUMTEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  github_url VARCHAR(255),
  demo_url VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_dates CHECK (start_date <= end_date)
);
CREATE TABLE academic (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  semester VARCHAR(100) NOT NULL,
  grade VARCHAR(10),
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE tech_stack (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  logo_url VARCHAR(255)
);
CREATE TABLE project_academic (
  project_id BIGINT NOT NULL,
  academic_id BIGINT NOT NULL,
  PRIMARY KEY (project_id, academic_id),
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  FOREIGN KEY (academic_id) REFERENCES academic(id)
);
CREATE TABLE project_tech_stack (
  project_id BIGINT NOT NULL,
  tech_stack_id BIGINT NOT NULL,
  PRIMARY KEY (project_id, tech_stack_id),
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  FOREIGN KEY (tech_stack_id) REFERENCES tech_stack(id)
);
CREATE INDEX idx_project_end_date ON project(end_date DESC);
CREATE INDEX idx_academic_semester ON academic(semester);
CREATE INDEX idx_tech_stack_type_name ON tech_stack(type, name);
```

## Migration Plan
- Use Flyway or Liquibase in Spring Boot.
- Versioning: V1__init.sql (tables), V2__constraints_indexes.sql, V3__seed_tech_stack.sql (optional).

## Data Access
- JPA entities matching columns with appropriate @ManyToMany via join tables.
- Read models for list views to avoid N+1 (use fetch joins or DTO projections).
