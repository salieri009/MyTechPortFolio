package com.mytechfolio.portfolio.repository.admin;

import com.mytechfolio.portfolio.domain.admin.AdminRole;
import com.mytechfolio.portfolio.domain.admin.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends MongoRepository<AdminUser, String> {
    
    // 기본 조회
    Optional<AdminUser> findByUsername(String username);
    
    Optional<AdminUser> findByEmail(String email);
    
    Optional<AdminUser> findByUsernameAndEnabled(String username, boolean enabled);
    
    Optional<AdminUser> findByEmailAndEnabled(String email, boolean enabled);
    
    // OAuth 관련
    Optional<AdminUser> findByOauthProviderAndOauthId(String oauthProvider, String oauthId);
    
    // 세션 관리
    Optional<AdminUser> findBySessionId(String sessionId);
    
    List<AdminUser> findByLastActivityAfter(LocalDateTime since);
    
    // 권한별 조회
    List<AdminUser> findByRole(AdminRole role);
    
    List<AdminUser> findByRoleAndEnabled(AdminRole role, boolean enabled);
    
    @Query("{ 'role': { $in: [?0] }, 'enabled': true }")
    List<AdminUser> findEnabledUsersByRoles(List<AdminRole> roles);
    
    // 관리 권한별 조회
    @Query("{ 'role': { $in: ['SUPER_ADMIN', 'ADMIN'] }, 'enabled': true }")
    List<AdminUser> findAllManagers();
    
    @Query("{ 'role': { $in: ['CONTENT_MANAGER', 'VIEWER'] }, 'enabled': true }")
    List<AdminUser> findAllManagedUsers();
    
    // 통계용 쿼리
    long countByEnabled(boolean enabled);
    
    long countByRole(AdminRole role);
    
    @Query(value = "{ 'enabled': true }", count = true)
    long countActiveUsers();
    
    @Query(value = "{ 'lastLoginAt': { $gte: ?0 } }", count = true)
    long countRecentlyActiveUsers(LocalDateTime since);
    
    @Query(value = "{ 'createdAt': { $gte: ?0 } }", count = true)
    long countNewUsersAfter(LocalDateTime since);
    
    // 집계 쿼리 (통계용)
    @Query(value = "{ $group: { _id: '$role', count: { $sum: 1 } } }")
    List<Object[]> countUsersByRole();
    
    // 보안 관련
    @Query("{ 'lastActivity': { $lt: ?0 } }")
    List<AdminUser> findInactiveUsersSince(LocalDateTime threshold);
    
    @Query("{ 'accountNonLocked': false }")
    List<AdminUser> findLockedUsers();
    
    @Query("{ 'twoFactorEnabled': true }")
    List<AdminUser> findUsersWithTwoFactor();
    
    // 관리용
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByOauthProviderAndOauthId(String oauthProvider, String oauthId);
    
    @Query(value = "{ $or: [ { 'username': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }, { 'fullName': { $regex: ?0, $options: 'i' } } ] }")
    List<AdminUser> searchUsers(String searchTerm);
    
    // 최근 활동 기준 조회 - 파생 쿼리 규칙에 맞는 메서드명 사용
    // 참고: 최근 활동 이후의 유저 조회는 아래 메서드로 대체합니다.
    // List<AdminUser> findByLastActivityAfter(LocalDateTime since);
    
    @Query("{ 'lastLoginAt': { $gte: ?0 }, 'enabled': true }")
    List<AdminUser> findRecentlyLoggedInUsers(LocalDateTime since);
    
    // 권한 레벨별 조회
    @Query("{ 'role': { $in: ['SUPER_ADMIN'] } }")
    List<AdminUser> findSuperAdmins();
    
    @Query("{ 'role': { $in: ['SUPER_ADMIN', 'ADMIN'] } }")
    List<AdminUser> findAdministrators();
    
    @Query("{ 'role': { $in: ['CONTENT_MANAGER'] } }")
    List<AdminUser> findContentManagers();
    
    @Query("{ 'role': { $in: ['VIEWER'] } }")
    List<AdminUser> findViewers();
    
    // 배치 처리용
    @Query("{ 'enabled': false, 'updatedAt': { $lt: ?0 } }")
    List<AdminUser> findDisabledUsersOlderThan(LocalDateTime threshold);
    
    void deleteByEnabledAndUpdatedAtBefore(boolean enabled, LocalDateTime threshold);
    
    // 디바이스 관리
    @Query("{ 'deviceFingerprint': ?0 }")
    List<AdminUser> findByDeviceFingerprint(String deviceFingerprint);
    
    // OAuth 사용자 조회
    @Query("{ 'oauthProvider': { $exists: true, $ne: null } }")
    List<AdminUser> findOAuthUsers();
    
    @Query("{ 'oauthProvider': ?0 }")
    List<AdminUser> findByOauthProvider(String provider);
}