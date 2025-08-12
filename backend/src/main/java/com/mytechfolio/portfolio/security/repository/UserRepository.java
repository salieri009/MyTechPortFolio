package com.mytechfolio.portfolio.security.repository;

import com.mytechfolio.portfolio.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByGoogleId(String googleId);
    
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
    
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.googleId = :googleId")
    Optional<User> findByGoogleIdWithRoles(@Param("googleId") String googleId);
    
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);
    
    boolean existsByEmail(String email);
    
    boolean existsByGoogleId(String googleId);
}
