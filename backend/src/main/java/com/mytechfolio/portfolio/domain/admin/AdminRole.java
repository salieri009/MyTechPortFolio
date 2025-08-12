package com.mytechfolio.portfolio.domain.admin;

import lombok.Getter;

@Getter
public enum AdminRole {
    SUPER_ADMIN("SUPER_ADMIN", "전체 시스템 관리자", 100),
    ADMIN("ADMIN", "일반 관리자", 80),
    CONTENT_MANAGER("CONTENT_MANAGER", "컨텐츠 관리자", 60),
    VIEWER("VIEWER", "조회 전용", 20);
    
    private final String code;
    private final String description;
    private final int level;
    
    AdminRole(String code, String description, int level) {
        this.code = code;
        this.description = description;
        this.level = level;
    }
    
    public boolean hasHigherAuthorityThan(AdminRole other) {
        return this.level > other.level;
    }
    
    public boolean hasPermission(String permission) {
        // Permission-based access control
        switch (this) {
            case SUPER_ADMIN:
                return true; // Super admin has all permissions
            case ADMIN:
                return !permission.startsWith("system.config") && !permission.startsWith("system.backup");
            case CONTENT_MANAGER:
                return permission.startsWith("content.") || permission.startsWith("media.") || permission.startsWith("project.");
            case VIEWER:
                return permission.endsWith(".read") || permission.endsWith(".view");
            default:
                return false;
        }
    }
    
    public boolean canManageProjects() {
        return this.level >= CONTENT_MANAGER.level;
    }
    
    public boolean canManageUsers() {
        return this.level >= ADMIN.level;
    }
    
    public boolean canManageSystem() {
        return this.level >= SUPER_ADMIN.level;
    }
}
