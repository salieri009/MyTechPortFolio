package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

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
}
