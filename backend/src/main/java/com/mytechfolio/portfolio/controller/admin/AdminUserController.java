package com.mytechfolio.portfolio.controller.admin;

import com.mytechfolio.portfolio.domain.admin.AdminRole;
import com.mytechfolio.portfolio.domain.admin.AdminUser;
import com.mytechfolio.portfolio.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://*.azurestaticapps.net"})
public class AdminUserController {
    
    private final AdminUserService adminUserService;
    
    // DTO Classes
    public static class CreateAdminRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        public String username;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        public String email;
        
        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must not exceed 100 characters")
        public String fullName;
        
        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        public String password;
        
        public AdminRole role = AdminRole.VIEWER;
    }
    
    public static class UpdateUserRequest {
        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must not exceed 100 characters")
        public String fullName;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        public String email;
    }
    
    public static class ChangePasswordRequest {
        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        public String newPassword;
    }
    
    public static class ChangeRoleRequest {
        public AdminRole role;
    }
    
    // CRUD Operations
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminUser>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) AdminRole role) {
        
        log.info("Fetching admin users - page: {}, size: {}, sortBy: {}, sortDir: {}", 
                page, size, sortBy, sortDir);
        
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<AdminUser> users;
        
        if (role != null && enabled != null) {
            users = adminUserService.findByRoleAndEnabled(role, enabled, pageable);
        } else if (enabled != null) {
            users = adminUserService.findByEnabled(enabled, pageable);
        } else {
            users = adminUserService.findAll(pageable);
        }
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUser> getUserById(@PathVariable Long id) {
        log.info("Fetching admin user by ID: {}", id);
        
        Optional<AdminUser> user = adminUserService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminUser>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching admin users with keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminUser> users = adminUserService.searchByKeyword(keyword, pageable);
        
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateAdminRequest request) {
        log.info("Creating new admin user: {}", request.username);
        
        try {
            AdminUser createdUser = adminUserService.createAdmin(
                    request.username,
                    request.email,
                    request.fullName,
                    request.password,
                    request.role
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            log.error("Failed to create admin user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, 
                                      @Valid @RequestBody UpdateUserRequest request) {
        log.info("Updating admin user ID: {}", id);
        
        try {
            AdminUser updatedUser = adminUserService.updateUserInfo(
                    id, request.fullName, request.email);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("Failed to update admin user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                          @Valid @RequestBody ChangePasswordRequest request) {
        log.info("Changing password for admin user ID: {}", id);
        
        try {
            AdminUser updatedUser = adminUserService.changePassword(id, request.newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Failed to change password: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> changeRole(@PathVariable Long id,
                                      @Valid @RequestBody ChangeRoleRequest request) {
        log.info("Changing role for admin user ID: {} to {}", id, request.role);
        
        try {
            AdminUser updatedUser = adminUserService.changeRole(id, request.role);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("Failed to change role: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> enableUser(@PathVariable Long id) {
        log.info("Enabling admin user ID: {}", id);
        
        try {
            AdminUser updatedUser = adminUserService.enableUser(id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("Failed to enable user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        log.info("Disabling admin user ID: {}", id);
        
        try {
            AdminUser updatedUser = adminUserService.disableUser(id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("Failed to disable user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("Deleting admin user ID: {}", id);
        
        try {
            adminUserService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Failed to delete user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Statistics and Utility Endpoints
    
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        log.info("Fetching user statistics");
        
        Map<String, Object> stats = Map.of(
                "totalUsers", adminUserService.getTotalUsers(),
                "activeUsers", adminUserService.getActiveUsers(),
                "recentlyActiveUsers", adminUserService.getRecentlyActiveUsers(30),
                "usersByRole", adminUserService.getUserStatsByRole()
        );
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUser>> getRecentlyActiveUsers(
            @RequestParam(defaultValue = "30") int days) {
        log.info("Fetching recently active users within {} days", days);
        
        List<AdminUser> users = adminUserService.getActiveUsersSince(days);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminRole[]> getAllRoles() {
        return ResponseEntity.ok(AdminRole.values());
    }
    
    // Validation Endpoints
    
    @GetMapping("/validate/username")
    public ResponseEntity<Map<String, Boolean>> validateUsername(@RequestParam String username) {
        boolean available = adminUserService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }
    
    @GetMapping("/validate/email")
    public ResponseEntity<Map<String, Boolean>> validateEmail(@RequestParam String email) {
        boolean available = adminUserService.isEmailAvailable(email);
        return ResponseEntity.ok(Map.of("available", available));
    }
}
