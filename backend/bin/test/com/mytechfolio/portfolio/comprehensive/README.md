# Comprehensive Test Suite

이 디렉토리는 백엔드 서비스에 대한 포괄적인 테스트 케이스를 포함합니다.

## 개선 사항

### 1. 하드코딩된 ID 제거
- **문제**: 하드코딩된 ObjectId (예: `675aa6818b8e5d32789d5801`) 사용으로 테스트가 취약함
- **해결**: `TestDataHelper` 클래스를 통해 동적으로 테스트 데이터 생성
- **사용법**:
```java
@Autowired
private TestDataHelper testDataHelper;

@Test
void testExample() throws Exception {
    // 동적으로 프로젝트 생성
    String projectId = testDataHelper.createTestProject("Test Title", "Summary");
    
    // 테스트 수행
    mockMvc.perform(get("/api/v1/projects/{id}", projectId))
        .andExpect(status().isOk());
}
```

### 2. 동시성 테스트 개선
- **문제**: `FrontendBackendConnectivityTest.test020_ConcurrentRequests`가 순차적으로 실행됨
- **해결**: `ExecutorService`를 사용하여 실제 병렬 요청 테스트
- **개선 내용**:
  - 10개의 동시 요청을 5개의 스레드 풀로 처리
  - 모든 요청의 성공 여부 검증

### 3. 테스트 데이터 정리
- **자동 정리**: `@AfterEach`를 통해 생성된 테스트 데이터 자동 삭제
- **메모리 누수 방지**: 테스트 간 데이터 격리

### 4. CI/CD 친화적
- **타임아웃 조정**: CI 환경의 가변 부하를 고려하여 타임아웃 증가 (5초 → 10초)
- **안정성 향상**: 플래키 테스트 감소

## 테스트 구조

```
comprehensive/
├── FunctionalTestSuite.java      # 기능 테스트 (CRUD, 경계 조건)
├── ApiLayerTestSuite.java        # API 레이어 테스트 (인증, CORS)
├── DatabaseTestSuite.java        # 데이터베이스 테스트 (CRUD, 무결성)
├── SecurityTestSuite.java        # 보안 테스트 (Injection, XSS, CSRF)
├── PerformanceTestSuite.java     # 성능 테스트 (동시성, SLA)
├── ObservabilityTestSuite.java   # 모니터링 테스트 (로깅, 메트릭)
└── TestDataHelper.java           # 테스트 데이터 헬퍼
```

## TestDataHelper 사용법

### 프로젝트 생성
```java
// 기본 프로젝트 생성
String projectId = testDataHelper.createTestProject();

// 커스텀 프로젝트 생성
String projectId = testDataHelper.createTestProject("My Project", "Summary");

// Tech Stack과 함께 생성
String techStackId = testDataHelper.findOrCreateTechStack("React");
String projectId = testDataHelper.createTestProjectWithTechStacks(
    "Project", List.of(techStackId)
);
```

### 데이터베이스 직접 생성 (빠른 단위 테스트용)
```java
Project project = testDataHelper.createTestProjectInDb("Fast Test");
```

### 정리
```java
// 개별 삭제
testDataHelper.deleteTestProject(projectId);

// 전체 삭제 (주의!)
testDataHelper.deleteAllTestProjects();
```

## 테스트 실행

### 전체 테스트 실행
```bash
./gradlew test
```

### 특정 테스트 스위트 실행
```bash
./gradlew test --tests "com.mytechfolio.portfolio.comprehensive.FunctionalTestSuite"
```

### CI/CD 통합
`FrontendBackendConnectivityTest`는 프론트엔드 배포 전에 반드시 실행되어야 합니다:
```yaml
# .github/workflows/test.yml 예시
- name: Run Frontend-Backend Connectivity Tests
  run: ./gradlew test --tests "com.mytechfolio.portfolio.integration.FrontendBackendConnectivityTest"
```

## 모범 사례

1. **항상 TestDataHelper 사용**: 하드코딩된 ID 사용 금지
2. **자동 정리**: `@AfterEach`에서 생성된 데이터 정리
3. **독립성**: 각 테스트는 독립적으로 실행 가능해야 함
4. **명확한 이름**: `@DisplayName`으로 테스트 의도 명확히 표현
5. **CI 안정성**: 타임아웃과 재시도 로직 고려

## 관련 문서

- [BACKEND_COMPREHENSIVE_TEST_CASES.md](../../../../docs/Testing/BACKEND_COMPREHENSIVE_TEST_CASES.md)
- [API Specification](../../../../docs/Specifications/API-Specification.md)

