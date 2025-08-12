package com.mytechfolio.portfolio.service.admin;

import com.mytechfolio.portfolio.domain.admin.AdminRole;
import com.mytechfolio.portfolio.domain.admin.AdminUser;
import com.mytechfolio.portfolio.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {
    
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Create Operations
    @Transactional
    public AdminUser createAdmin(String username, String email, String fullName, 
                                String password, AdminRole role) {
        log.info("Creating new admin user: {}", username);
        
        // Validation
        if (adminUserRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        
        if (adminUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        
        // Create admin user
        AdminUser adminUser = AdminUser.builder()
                .username(username)
                .email(email)
                .fullName(fullName)
                .password(passwordEncoder.encode(password))
                .role(role)
                .enabled(true)
                .build();
        
        AdminUser saved = adminUserRepository.save(adminUser);
        log.info("Successfully created admin user with ID: {}", saved.getId());
        
        return saved;
    }
    
    @Transactional
    public AdminUser createSuperAdmin(String username, String email, String fullName, String password) {
        return createAdmin(username, email, fullName, password, AdminRole.SUPER_ADMIN);
    }
    
    // Read Operations
    public Optional<AdminUser> findById(Long id) {
        return adminUserRepository.findById(id);
    }
    
    public Optional<AdminUser> findByUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }
    
    public Optional<AdminUser> findByEmail(String email) {
        return adminUserRepository.findByEmail(email);
    }
    
    public Page<AdminUser> findAll(Pageable pageable) {
        return adminUserRepository.findAll(pageable);
    }
    
    public Page<AdminUser> findByEnabled(Boolean enabled, Pageable pageable) {
        return adminUserRepository.findByEnabledOrderByCreatedAtDesc(enabled, pageable);
    }
    
    public Page<AdminUser> searchByKeyword(String keyword, Pageable pageable) {
        return adminUserRepository.searchByKeyword(keyword, pageable);
    }
    
    public List<AdminUser> findByRole(AdminRole role) {
        return adminUserRepository.findByRole(role);
    }
    
    public Page<AdminUser> findByRoleAndEnabled(AdminRole role, Boolean enabled, Pageable pageable) {
        return adminUserRepository.findByRoleAndEnabled(role, enabled, pageable);
    }
    
    // Update Operations
    @Transactional
    public AdminUser updateUserInfo(Long id, String fullName, String email) {
        log.info("Updating user info for admin ID: {}", id);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        // Check email uniqueness if changed
        if (!adminUser.getEmail().equals(email) && adminUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        
        adminUser.updateUserInfo(fullName, email);
        AdminUser updated = adminUserRepository.save(adminUser);
        
        log.info("Successfully updated user info for admin ID: {}", id);
        return updated;
    }
    
    @Transactional
    public AdminUser changePassword(Long id, String newPassword) {
        log.info("Changing password for admin ID: {}", id);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        adminUser.changePassword(passwordEncoder.encode(newPassword));
        AdminUser updated = adminUserRepository.save(adminUser);
        
        log.info("Successfully changed password for admin ID: {}", id);
        return updated;
    }
    
    @Transactional
    public AdminUser changeRole(Long id, AdminRole newRole) {
        log.info("Changing role for admin ID: {} to {}", id, newRole);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        adminUser.changeRole(newRole);
        AdminUser updated = adminUserRepository.save(adminUser);
        
        log.info("Successfully changed role for admin ID: {} to {}", id, newRole);
        return updated;
    }
    
    @Transactional
    public AdminUser enableUser(Long id) {
        log.info("Enabling admin user ID: {}", id);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        adminUser.enable();
        AdminUser updated = adminUserRepository.save(adminUser);
        
        log.info("Successfully enabled admin user ID: {}", id);
        return updated;
    }
    
    @Transactional
    public AdminUser disableUser(Long id) {
        log.info("Disabling admin user ID: {}", id);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        adminUser.disable();
        AdminUser updated = adminUserRepository.save(adminUser);
        
        log.info("Successfully disabled admin user ID: {}", id);
        return updated;
    }
    
    @Transactional
    public void recordLogin(String username) {
        log.debug("Recording login for username: {}", username);
        
        adminUserRepository.findByUsername(username)
                .ifPresent(adminUser -> {
                    adminUser.recordLogin();
                    adminUserRepository.save(adminUser);
                    log.debug("Recorded login for admin user ID: {}", adminUser.getId());
                });
    }
    
    // Delete Operations
    @Transactional
    public void deleteById(Long id) {
        log.info("Deleting admin user ID: {}", id);
        
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + id));
        
        // Prevent deletion of super admin if it's the last one
        if (adminUser.getRole() == AdminRole.SUPER_ADMIN) {
            long superAdminCount = adminUserRepository.findByRole(AdminRole.SUPER_ADMIN).size();
            if (superAdminCount <= 1) {
                throw new IllegalStateException("Cannot delete the last super admin");
            }
        }
        
        adminUserRepository.deleteById(id);
        log.info("Successfully deleted admin user ID: {}", id);
    }
    
    // Statistics and Utility Methods
    public long getTotalUsers() {
        return adminUserRepository.count();
    }
    
    public long getActiveUsers() {
        return adminUserRepository.countActiveUsers();
    }
    
    public long getRecentlyActiveUsers(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return adminUserRepository.countRecentlyActiveUsers(since);
    }
    
    public List<Object[]> getUserStatsByRole() {
        return adminUserRepository.countUsersByRole();
    }
    
    public List<AdminUser> getActiveUsersSince(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return adminUserRepository.findActiveUsersSince(since);
    }
    
    // Validation Methods
    public boolean isUsernameAvailable(String username) {
        return !adminUserRepository.existsByUsername(username);
    }
    
    public boolean isEmailAvailable(String email) {
        return !adminUserRepository.existsByEmail(email);
    }
    
    public boolean hasPermission(String username, String permission) {
        return adminUserRepository.findByUsername(username)
                .map(user -> user.hasPermission(permission))
                .orElse(false);
    }
    
    public boolean canManageUser(String managerUsername, Long targetUserId) {
        Optional<AdminUser> manager = adminUserRepository.findByUsername(managerUsername);
        Optional<AdminUser> target = adminUserRepository.findById(targetUserId);
        
        if (manager.isEmpty() || target.isEmpty()) {
            return false;
        }
        
        return manager.get().canManage(target.get());
    }
}
