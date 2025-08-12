-- ==========================================
-- Visitor Analytics Database Schema
-- Advanced Analytics and Tracking System
-- ==========================================

-- Create visitor_log table for detailed visit tracking
CREATE TABLE IF NOT EXISTS visitor_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500),
    page_path VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    visit_time TIMESTAMP NOT NULL,
    visit_date DATE NOT NULL,
    session_id VARCHAR(100),
    referrer VARCHAR(500),
    country VARCHAR(100),
    country_code VARCHAR(3),
    city VARCHAR(100),
    region VARCHAR(100),
    timezone VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    device_type VARCHAR(50),
    is_mobile BOOLEAN DEFAULT FALSE,
    screen_resolution VARCHAR(20),
    visit_duration BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create page_view_statistics table for aggregated page metrics
CREATE TABLE IF NOT EXISTS page_view_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_path VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    view_date DATE NOT NULL,
    total_views BIGINT NOT NULL DEFAULT 0,
    unique_visitors BIGINT NOT NULL DEFAULT 0,
    total_duration BIGINT DEFAULT 0,
    bounce_rate DOUBLE DEFAULT 0.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create visitor_statistics table for comprehensive analytics
CREATE TABLE IF NOT EXISTS visitor_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    statistics_date DATE NOT NULL,
    statistics_type VARCHAR(50) NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    hour_of_day INTEGER,
    total_visitors BIGINT NOT NULL DEFAULT 0,
    unique_visitors BIGINT NOT NULL DEFAULT 0,
    total_page_views BIGINT NOT NULL DEFAULT 0,
    average_session_duration DOUBLE DEFAULT 0.0,
    bounce_rate DOUBLE DEFAULT 0.0,
    new_visitors BIGINT DEFAULT 0,
    returning_visitors BIGINT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_log_timestamp ON visitor_log(visit_time);
CREATE INDEX IF NOT EXISTS idx_visitor_log_page ON visitor_log(page_path);
CREATE INDEX IF NOT EXISTS idx_visitor_log_ip ON visitor_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_log_date ON visitor_log(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_log_session ON visitor_log(session_id);

CREATE INDEX IF NOT EXISTS idx_page_stats_path_date ON page_view_statistics(page_path, view_date);
CREATE INDEX IF NOT EXISTS idx_page_stats_date ON page_view_statistics(view_date);
CREATE INDEX IF NOT EXISTS idx_page_stats_views ON page_view_statistics(total_views);

CREATE INDEX IF NOT EXISTS idx_visitor_stats_date_type ON visitor_statistics(statistics_date, statistics_type);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_statistics(statistics_date);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_location ON visitor_statistics(country, city);

-- Add constraints for data integrity
ALTER TABLE page_view_statistics ADD CONSTRAINT IF NOT EXISTS unique_page_date UNIQUE(page_path, view_date);
ALTER TABLE visitor_statistics ADD CONSTRAINT IF NOT EXISTS unique_stats_entry UNIQUE(statistics_date, statistics_type, country, city, hour_of_day);

COMMIT;
