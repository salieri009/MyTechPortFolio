package com.mytechfolio.portfolio.domain.admin;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_users")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "password")
public class AdminUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "full_name", length = 100)
    private String fullName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AdminRole role = AdminRole.VIEWER;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean accountNonExpired = true;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean accountNonLocked = true;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean credentialsNonExpired = true;
    
    private LocalDateTime lastLoginAt;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Business Methods
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }
    
    public void recordLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updateProfile(String email, String fullName) {
        this.email = email;
        this.fullName = fullName;
    }
    
    public void updateUserInfo(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    public void deactivate() {
        this.enabled = false;
    }
    
    public void disable() {
        this.enabled = false;
    }

    public void activate() {
        this.enabled = true;
    }
    
    public void enable() {
        this.enabled = true;
    }
    
    public void changeRole(AdminRole newRole) {
        this.role = newRole;
    }

    public boolean isActive() {
        return enabled && accountNonExpired && accountNonLocked && credentialsNonExpired;
    }
    
    public String getDisplayName() {
        return fullName != null ? fullName : username;
    }
    
    // Permission and Authority Methods
    public boolean hasPermission(String permission) {
        return role.hasPermission(permission);
    }
    
    public boolean canManage(AdminUser targetUser) {
        // Super admin can manage anyone
        if (this.role == AdminRole.SUPER_ADMIN) {
            return true;
        }
        
        // Admin can manage content managers and viewers
        if (this.role == AdminRole.ADMIN) {
            return targetUser.role == AdminRole.CONTENT_MANAGER || 
                   targetUser.role == AdminRole.VIEWER;
        }
        
        // Content managers and viewers cannot manage other users
        return false;
    }
    
    public boolean hasHigherOrEqualAuthority(AdminUser otherUser) {
        return this.role.ordinal() <= otherUser.role.ordinal();
    }
}
