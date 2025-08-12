package com.mytechfolio.portfolio.repository.admin;

import com.mytechfolio.portfolio.domain.admin.AdminRole;
import com.mytechfolio.portfolio.domain.admin.AdminUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    // Basic Queries
    Optional<AdminUser> findByUsername(String username);
    Optional<AdminUser> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Role-based Queries
    List<AdminUser> findByRole(AdminRole role);
    List<AdminUser> findByRoleIn(List<AdminRole> roles);
    
    // Status-based Queries
    List<AdminUser> findByEnabled(Boolean enabled);
    Page<AdminUser> findByEnabledOrderByCreatedAtDesc(Boolean enabled, Pageable pageable);
    
    // Advanced Queries
    @Query("SELECT a FROM AdminUser a WHERE a.enabled = true AND a.lastLoginAt > :since")
    List<AdminUser> findActiveUsersSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM AdminUser a WHERE " +
           "(LOWER(a.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY a.createdAt DESC")
    Page<AdminUser> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT a FROM AdminUser a WHERE a.role = :role AND a.enabled = :enabled ORDER BY a.lastLoginAt DESC")
    Page<AdminUser> findByRoleAndEnabled(@Param("role") AdminRole role, @Param("enabled") Boolean enabled, Pageable pageable);
    
    // Statistics Queries
    @Query("SELECT COUNT(a) FROM AdminUser a WHERE a.enabled = true")
    long countActiveUsers();
    
    @Query("SELECT a.role, COUNT(a) FROM AdminUser a WHERE a.enabled = true GROUP BY a.role")
    List<Object[]> countUsersByRole();
    
    @Query("SELECT COUNT(a) FROM AdminUser a WHERE a.lastLoginAt > :since")
    long countRecentlyActiveUsers(@Param("since") LocalDateTime since);
}
