package com.mytechfolio.portfolio.repository;

import com.mytechfolio.portfolio.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // 기본 조회
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndEnabled(String email, boolean enabled);
    
    // OAuth 관련
    Optional<User> findByOauthProviderAndOauthId(String oauthProvider, String oauthId);
    
    Optional<User> findByOauthProviderAndOauthIdAndEnabled(String oauthProvider, String oauthId, boolean enabled);
    
    // 세션 관리
    Optional<User> findBySessionId(String sessionId);
    
    List<User> findByLastActivityAfter(LocalDateTime since);
    
    // 권한별 조회
    List<User> findByRole(User.Role role);
    
    @Query("{ 'roles': { $in: [?0] } }")
    List<User> findByRolesContaining(String role);
    
    @Query("{ 'role': ?0, 'enabled': true }")
    List<User> findEnabledUsersByRole(User.Role role);
    
    // 통계용 쿼리
    long countByEnabled(boolean enabled);
    
    long countByRole(User.Role role);
    
    @Query(value = "{ 'createdAt': { $gte: ?0 } }", count = true)
    long countNewUsersAfter(LocalDateTime since);
    
    @Query(value = "{ 'lastLogin': { $gte: ?0 } }", count = true)
    long countActiveUsersAfter(LocalDateTime since);
    
    // 분석용 쿼리
    @Query("{ 'registrationSource': ?0 }")
    List<User> findByRegistrationSource(String source);
    
    @Query("{ 'oauthProvider': { $exists: true, $ne: null } }")
    List<User> findOAuthUsers();
    
    @Query("{ 'twoFactorEnabled': true }")
    List<User> findUsersWithTwoFactor();
    
    // 보안 관련
    @Query("{ 'lastActivity': { $lt: ?0 } }")
    List<User> findInactiveUsersSince(LocalDateTime threshold);
    
    @Query("{ 'deviceFingerprint': ?0 }")
    List<User> findByDeviceFingerprint(String deviceFingerprint);
    
    // 관리용
    boolean existsByEmail(String email);
    
    boolean existsByOauthProviderAndOauthId(String oauthProvider, String oauthId);
    
    @Query(value = "{ 'email': { $regex: ?0, $options: 'i' } }")
    List<User> findByEmailContainingIgnoreCase(String emailPattern);
    
    // 배치 처리용
    @Query("{ 'enabled': false, 'updatedAt': { $lt: ?0 } }")
    List<User> findDisabledUsersOlderThan(LocalDateTime threshold);
    
    void deleteByEnabledAndUpdatedAtBefore(boolean enabled, LocalDateTime threshold);
}