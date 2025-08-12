-- Create admin_users table for administrative access
CREATE TABLE admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_enabled (enabled),
    INDEX idx_created_at (created_at)
);

-- Create default super admin user (password: admin123!)
-- Password hash generated with BCrypt strength 10
INSERT INTO admin_users (username, password, email, full_name, role, enabled) 
VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8lBvd0K4YXuXF6PKe8Z2F5tQ0YhGNu', 'admin@mytechfolio.com', 'System Administrator', 'SUPER_ADMIN', true);

-- Create audit log table for tracking administrative changes
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id BIGINT,
    username VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Add admin tracking columns to existing projects table (if exists)
-- This will safely add columns only if the projects table exists
SET @sql = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects') > 0,
    'ALTER TABLE projects 
     ADD COLUMN IF NOT EXISTS created_by BIGINT,
     ADD COLUMN IF NOT EXISTS updated_by BIGINT,
     ADD FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
     ADD FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL',
    'SELECT "Projects table does not exist, skipping admin columns"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
