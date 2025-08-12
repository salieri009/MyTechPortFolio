-- ==========================================
-- Initial Database Schema Creation
-- Portfolio Management System
-- ==========================================

-- Create tech_stack table
CREATE TABLE IF NOT EXISTS tech_stack (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create academic table
CREATE TABLE IF NOT EXISTS academic (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester VARCHAR(100) NOT NULL,
    grade VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create project table
CREATE TABLE IF NOT EXISTS project (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create many-to-many relationship tables
CREATE TABLE IF NOT EXISTS project_tech_stack (
    project_id BIGINT NOT NULL,
    tech_stack_id BIGINT NOT NULL,
    PRIMARY KEY (project_id, tech_stack_id),
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (tech_stack_id) REFERENCES tech_stack(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_academic (
    project_id BIGINT NOT NULL,
    academic_id BIGINT NOT NULL,
    PRIMARY KEY (project_id, academic_id),
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_id) REFERENCES academic(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tech_stack_type ON tech_stack(type);
CREATE INDEX IF NOT EXISTS idx_academic_semester ON academic(semester);
CREATE INDEX IF NOT EXISTS idx_project_dates ON project(start_date, end_date);

COMMIT;
