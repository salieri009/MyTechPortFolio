-- ==========================================
-- Sample Visitor Analytics Data
-- Test Data for Development and Demo
-- ==========================================

-- Insert sample visitor logs for testing
INSERT INTO visitor_log (
    ip_address, user_agent, page_path, page_title, visit_time, visit_date, 
    session_id, referrer, country, country_code, city, region, 
    browser, operating_system, device_type, is_mobile
) VALUES 
-- Today's visits
('192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/', 'Home', NOW(), CURDATE(), 'session_001', NULL, 'South Korea', 'KR', 'Seoul', 'Seoul', 'Chrome', 'Windows', 'Desktop', FALSE),
('192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '/projects', 'Projects', NOW(), CURDATE(), 'session_002', 'https://google.com', 'United States', 'US', 'New York', 'NY', 'Safari', 'macOS', 'Desktop', FALSE),
('192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '/about', 'About', NOW(), CURDATE(), 'session_003', 'https://linkedin.com', 'Japan', 'JP', 'Tokyo', 'Tokyo', 'Safari', 'iOS', 'Mobile', TRUE),
('192.168.1.103', 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36', '/skills', 'Skills', NOW(), CURDATE(), 'session_004', NULL, 'Germany', 'DE', 'Berlin', 'Berlin', 'Chrome', 'Android', 'Mobile', TRUE),
('192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101', '/contact', 'Contact', NOW(), CURDATE(), 'session_005', 'https://github.com', 'United Kingdom', 'GB', 'London', 'England', 'Firefox', 'Windows', 'Desktop', FALSE),

-- Yesterday's visits
('192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/', 'Home', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'session_006', NULL, 'Canada', 'CA', 'Toronto', 'Ontario', 'Chrome', 'Windows', 'Desktop', FALSE),
('192.168.1.106', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '/projects', 'Projects', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'session_007', 'https://stackoverflow.com', 'Australia', 'AU', 'Sydney', 'NSW', 'Safari', 'macOS', 'Desktop', FALSE),
('192.168.1.107', 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36', '/academics', 'Academic Background', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'session_008', NULL, 'France', 'FR', 'Paris', 'Île-de-France', 'Chrome', 'Android', 'Mobile', TRUE),

-- Last week's visits
('192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/', 'Home', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'session_009', 'https://twitter.com', 'Brazil', 'BR', 'São Paulo', 'SP', 'Chrome', 'Windows', 'Desktop', FALSE),
('192.168.1.109', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '/projects', 'Projects', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'session_010', NULL, 'India', 'IN', 'Mumbai', 'Maharashtra', 'Safari', 'iOS', 'Tablet', FALSE),
('192.168.1.110', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '/skills', 'Skills', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'session_011', 'https://dev.to', 'Netherlands', 'NL', 'Amsterdam', 'North Holland', 'Chrome', 'Linux', 'Desktop', FALSE);

-- Insert sample page view statistics
INSERT INTO page_view_statistics (
    page_path, page_title, view_date, total_views, unique_visitors, 
    total_duration, bounce_rate, last_updated
) VALUES 
-- Today's statistics
('/', 'Home', CURDATE(), 15, 12, 45000, 25.5, NOW()),
('/projects', 'Projects', CURDATE(), 8, 7, 32000, 15.2, NOW()),
('/skills', 'Skills', CURDATE(), 6, 5, 28000, 35.8, NOW()),
('/about', 'About', CURDATE(), 4, 4, 22000, 45.1, NOW()),
('/contact', 'Contact', CURDATE(), 3, 3, 18000, 55.3, NOW()),
('/academics', 'Academic Background', CURDATE(), 2, 2, 15000, 12.7, NOW()),

-- Yesterday's statistics
('/', 'Home', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12, 10, 38000, 28.3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('/projects', 'Projects', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 9, 8, 35000, 18.7, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('/skills', 'Skills', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 7, 6, 30000, 32.1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('/about', 'About', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5, 4, 25000, 42.8, DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Last week's statistics
('/', 'Home', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 20, 18, 52000, 22.1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('/projects', 'Projects', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 14, 12, 48000, 16.5, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('/skills', 'Skills', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 11, 9, 42000, 28.9, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Insert sample visitor statistics
INSERT INTO visitor_statistics (
    statistics_date, statistics_type, country, city, hour_of_day,
    total_visitors, unique_visitors, total_page_views, 
    average_session_duration, bounce_rate, new_visitors, returning_visitors,
    last_updated
) VALUES 
-- Daily statistics
(CURDATE(), 'DAILY', NULL, NULL, NULL, 25, 20, 38, 2500.0, 28.5, 18, 7, NOW()),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'DAILY', NULL, NULL, NULL, 22, 18, 33, 2800.0, 25.2, 15, 7, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'DAILY', NULL, NULL, NULL, 18, 15, 28, 2650.0, 30.1, 12, 6, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Country statistics for today
(CURDATE(), 'COUNTRY', 'South Korea', NULL, NULL, 8, 7, 12, 2400.0, 25.0, 6, 2, NOW()),
(CURDATE(), 'COUNTRY', 'United States', NULL, NULL, 6, 5, 9, 2600.0, 30.5, 4, 2, NOW()),
(CURDATE(), 'COUNTRY', 'Japan', NULL, NULL, 4, 3, 6, 2200.0, 35.2, 3, 1, NOW()),
(CURDATE(), 'COUNTRY', 'Germany', NULL, NULL, 3, 3, 5, 2800.0, 22.8, 2, 1, NOW()),
(CURDATE(), 'COUNTRY', 'United Kingdom', NULL, NULL, 2, 2, 3, 2300.0, 28.7, 2, 0, NOW()),

-- City statistics for today
(CURDATE(), 'CITY', NULL, 'Seoul', NULL, 8, 7, 12, 2400.0, 25.0, 6, 2, NOW()),
(CURDATE(), 'CITY', NULL, 'New York', NULL, 6, 5, 9, 2600.0, 30.5, 4, 2, NOW()),
(CURDATE(), 'CITY', NULL, 'Tokyo', NULL, 4, 3, 6, 2200.0, 35.2, 3, 1, NOW()),
(CURDATE(), 'CITY', NULL, 'Berlin', NULL, 3, 3, 5, 2800.0, 22.8, 2, 1, NOW()),

-- Hourly statistics for today
(CURDATE(), 'HOURLY', NULL, NULL, 9, 3, 3, 5, 2100.0, 33.3, 2, 1, NOW()),
(CURDATE(), 'HOURLY', NULL, NULL, 10, 5, 4, 8, 2400.0, 25.0, 3, 2, NOW()),
(CURDATE(), 'HOURLY', NULL, NULL, 11, 4, 4, 6, 2600.0, 28.5, 3, 1, NOW()),
(CURDATE(), 'HOURLY', NULL, NULL, 14, 6, 5, 9, 2350.0, 30.2, 4, 2, NOW()),
(CURDATE(), 'HOURLY', NULL, NULL, 15, 4, 3, 6, 2850.0, 22.1, 2, 2, NOW()),
(CURDATE(), 'HOURLY', NULL, NULL, 16, 3, 3, 4, 2200.0, 35.8, 2, 1, NOW());

COMMIT;
