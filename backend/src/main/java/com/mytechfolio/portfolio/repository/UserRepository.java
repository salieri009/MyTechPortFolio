package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by OAuth provider and OAuth ID
     */
    Optional<User> findByOauthProviderAndOauthId(String oauthProvider, String oauthId);

    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Find users by role
     */
    List<User> findByRole(User.Role role);

    /**
     * Find enabled users
     */
    List<User> findByEnabledTrue();

    /**
     * Find users who have 2FA enabled
     */
    List<User> findByTwoFactorEnabledTrue();

    /**
     * Find users who haven't logged in since a specific date
     */
    @Query("SELECT u FROM User u WHERE u.lastLogin < :date OR u.lastLogin IS NULL")
    List<User> findUsersNotLoggedInSince(@Param("date") LocalDateTime date);

    /**
     * Count total users
     */
    @Query("SELECT COUNT(u) FROM User u")
    long countTotalUsers();

    /**
     * Count active users (logged in within last 30 days)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :thirtyDaysAgo")
    long countActiveUsers(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
}
