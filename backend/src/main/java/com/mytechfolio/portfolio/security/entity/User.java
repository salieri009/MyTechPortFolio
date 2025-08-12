package com.mytechfolio.portfolio.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "google_id", unique = true)
    private String googleId;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @Column(name = "picture_url")
    private String pictureUrl;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Column(name = "two_factor_secret")
    private String twoFactorSecret;
    
    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled = false;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    public User(String email, String name, String googleId) {
        this.email = email;
        this.name = name;
        this.googleId = googleId;
    }
    
    public boolean hasRole(String roleName) {
        return roles.stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }
    
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
