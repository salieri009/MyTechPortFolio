# 에러 핸들링 테스트

## 목적
시스템의 모든 계층에서 예외 상황과 에러 케이스가 적절히 처리되고, 사용자에게 명확하고 도움이 되는 피드백을 제공하는지 검증

## 테스트 범위
- Frontend 에러 처리
- Backend API 에러 응답
- Database 연결 및 쿼리 에러
- 네트워크 및 외부 의존성 에러
- 사용자 입력 검증 에러

## 1. Frontend 에러 처리 테스트

### 1.1 API 통신 에러

#### 테스트 케이스 1.1.1: Backend 서버 중단
**시나리오**: Backend 서버가 중단된 상태에서 Frontend 접근

**테스트 단계**:
1. Backend 서버 중단 (`Ctrl+C`)
2. 브라우저에서 http://localhost:5174/projects 접속
3. 에러 처리 확인

**기대 결과**:
```
사용자 화면:
- ✅ 무한 로딩 상태가 아닌 명확한 에러 메시지
- ✅ "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
- ✅ 새로고침 버튼 또는 재시도 버튼 제공
- ✅ 다른 페이지로 이동할 수 있는 네비게이션 유지

Console 로그:
- ✅ 에러 상세 정보 기록 (개발자용)
- ✅ 사용자 개인정보 노출 없음
```

#### 테스트 케이스 1.1.2: 네트워크 타임아웃
**시나리오**: 네트워크가 느려 API 응답이 지연되는 상황

**테스트 설정**:
```bash
# Chrome DevTools Network 탭
# Throttling: Slow 3G
# 또는 Backend에서 인위적 지연 추가
```

**기대 결과**:
```
- ✅ 로딩 상태 표시 (스피너, 스켈레톤 UI)
- ✅ 30초 후 타임아웃 에러 메시지
- ✅ 재시도 옵션 제공
- ✅ 사용자가 다른 작업 가능한 상태 유지
```

#### 테스트 케이스 1.1.3: 잘못된 JSON 응답
**시나리오**: Backend에서 유효하지 않은 JSON 응답 반환

**테스트 방법**:
```bash
# Backend API를 일시적으로 수정하여 잘못된 JSON 반환
# 또는 Proxy에서 응답 변조
```

**기대 결과**:
```
- ✅ JSON 파싱 에러 적절히 처리
- ✅ "데이터를 불러오는 중 문제가 발생했습니다"
- ✅ 기술적 에러 메시지는 console에만 출력
- ✅ 사용자에게는 이해하기 쉬운 메시지 표시
```

### 1.2 클라이언트 사이드 에러

#### 테스트 케이스 1.2.1: JavaScript 런타임 에러
**시나리오**: TypeScript/JavaScript 코드에서 예상치 못한 에러 발생

**테스트 방법**:
```javascript
// 브라우저 Console에서 의도적 에러 발생
window.testError = () => {
  throw new Error("테스트 런타임 에러");
};
window.testError();
```

**기대 결과**:
```
- ✅ Error Boundary가 에러를 잡아 처리
- ✅ "문제가 발생했습니다" 화면 표시
- ✅ 홈페이지로 돌아가기 버튼 제공
- ✅ 에러 정보가 로깅 시스템에 전송 (추후 구현)
```

#### 테스트 케이스 1.2.2: 메모리 부족 상황
**시나리오**: 대용량 데이터 처리 시 브라우저 메모리 부족

**테스트 방법**:
```javascript
// 의도적으로 대량의 데이터 생성
const largeArray = new Array(10000000).fill({
  id: Math.random(),
  data: new Array(1000).fill("test data")
});
```

**기대 결과**:
```
- ✅ 브라우저 크래시 방지
- ✅ 가상화 또는 페이징으로 메모리 사용량 제한
- ✅ 사용자에게 메모리 부족 경고 (필요시)
```

### 1.3 라우팅 및 네비게이션 에러

#### 테스트 케이스 1.3.1: 존재하지 않는 페이지 접근
**시나리오**: 잘못된 URL로 직접 접근

**테스트 URL**:
```
http://localhost:5174/nonexistent-page
http://localhost:5174/projects/999999
http://localhost:5174/academics/invalid-id
```

**기대 결과**:
```
- ✅ 404 Not Found 페이지 표시
- ✅ "페이지를 찾을 수 없습니다" 메시지
- ✅ 홈페이지 또는 주요 섹션으로 이동 링크
- ✅ 검색 기능 제공 (선택적)
- ✅ 사이트맵 또는 주요 페이지 목록
```

#### 테스트 케이스 1.3.2: 라우팅 파라미터 에러
**시나리오**: 유효하지 않은 파라미터로 페이지 접근

**테스트 URL**:
```
http://localhost:5174/projects/abc
http://localhost:5174/projects/-1
http://localhost:5174/projects/0
```

**기대 결과**:
```
- ✅ 파라미터 유효성 검사
- ✅ 적절한 에러 페이지 또는 리다이렉트
- ✅ "유효하지 않은 프로젝트 ID입니다"
```

## 2. Backend API 에러 처리 테스트

### 2.1 HTTP 상태 코드 에러

#### 테스트 케이스 2.1.1: 400 Bad Request
**시나리오**: 잘못된 요청 파라미터 전송

**테스트 요청**:
```bash
# 잘못된 페이지 번호
curl -X GET "http://localhost:8080/api/projects?page=-1&size=0"

# 잘못된 정렬 파라미터
curl -X GET "http://localhost:8080/api/projects?sort=invalid_field"

# 잘못된 데이터 타입
curl -X GET "http://localhost:8080/api/projects?year=abc"
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "잘못된 요청 파라미터입니다.",
    "details": {
      "page": "페이지 번호는 1 이상이어야 합니다.",
      "size": "페이지 크기는 1-100 사이여야 합니다."
    }
  }
}
```

#### 테스트 케이스 2.1.2: 404 Not Found
**시나리오**: 존재하지 않는 리소스 요청

**테스트 요청**:
```bash
curl -X GET "http://localhost:8080/api/projects/999999"
curl -X GET "http://localhost:8080/api/academics/999999"
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "요청한 프로젝트를 찾을 수 없습니다.",
    "details": {
      "resource": "Project",
      "id": 999999
    }
  }
}
```

#### 테스트 케이스 2.1.3: 500 Internal Server Error
**시나리오**: 서버 내부 에러 발생

**테스트 방법**:
```java
// ProjectService에서 의도적 에러 발생
@GetMapping("/test-error")
public ResponseEntity<?> testError() {
    throw new RuntimeException("테스트용 내부 에러");
}
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    "details": null
  }
}
```

**추가 검증**:
```
- ✅ 스택 트레이스가 클라이언트에 노출되지 않음
- ✅ 에러 로그가 서버에 기록됨
- ✅ 에러 ID 생성으로 추적 가능
```

### 2.2 데이터 검증 에러

#### 테스트 케이스 2.2.1: 필수 필드 누락
**시나리오**: Admin API에서 프로젝트 생성 시 필수 필드 누락

**테스트 요청**:
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "제목이 없는 프로젝트",
    "startDate": "2024-01-01"
  }'
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터 검증에 실패했습니다.",
    "details": {
      "title": "제목은 필수 입력 항목입니다.",
      "endDate": "종료일은 필수 입력 항목입니다."
    }
  }
}
```

#### 테스트 케이스 2.2.2: 데이터 형식 오류
**시나리오**: 잘못된 날짜 형식, 범위 초과 등

**테스트 요청**:
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 프로젝트",
    "summary": "요약",
    "startDate": "2024-13-32",
    "endDate": "2023-01-01",
    "techStackIds": [999]
  }'
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터 검증에 실패했습니다.",
    "details": {
      "startDate": "유효하지 않은 날짜 형식입니다.",
      "endDate": "종료일은 시작일보다 늦어야 합니다.",
      "techStackIds": "존재하지 않는 기술 스택 ID가 포함되어 있습니다."
    }
  }
}
```

## 3. Database 에러 처리 테스트

### 3.1 연결 에러

#### 테스트 케이스 3.1.1: 데이터베이스 연결 실패
**시나리오**: 데이터베이스 서버 중단 또는 연결 불가

**테스트 방법**:
```bash
# H2 데이터베이스 파일 삭제 또는 권한 변경
# 또는 application.yml의 데이터베이스 설정 변경
```

**기대 결과**:
```
- ✅ 애플리케이션 시작 실패 (Graceful degradation)
- ✅ Health Check 엔드포인트에서 DB 상태 확인 가능
- ✅ 명확한 에러 로그 기록
- ✅ 운영진에게 알림 전송 (추후 구현)
```

### 3.2 쿼리 에러

#### 테스트 케이스 3.2.1: SQL 구문 오류
**시나리오**: JPA 쿼리에서 구문 오류 발생

**테스트 방법**:
```java
// Repository에서 잘못된 쿼리 작성
@Query("SELECT p FROM Projects p WHERE p.invalidField = :value")
List<Project> findByInvalidField(@Param("value") String value);
```

**기대 결과**:
```
- ✅ 애플리케이션 시작 시점에 오류 감지
- ✅ 또는 런타임에서 적절한 에러 처리
- ✅ 500 에러 응답 with 일반적 메시지
```

#### 테스트 케이스 3.2.2: 제약 조건 위반
**시나리오**: 유니크 제약, 외래 키 제약 위반

**테스트 요청**:
```bash
# 동일한 이름의 기술 스택 생성 시도
curl -X POST "http://localhost:8080/admin/tech-stacks" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React",
    "type": "FRONTEND"
  }'
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "CONSTRAINT_VIOLATION",
    "message": "이미 존재하는 기술 스택 이름입니다.",
    "details": {
      "field": "name",
      "value": "React"
    }
  }
}
```

### 3.3 트랜잭션 에러

#### 테스트 케이스 3.3.1: 트랜잭션 롤백
**시나리오**: 프로젝트 생성 중 기술 스택 연결 실패

**테스트 요청**:
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 프로젝트",
    "summary": "요약",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "techStackIds": [1, 999]
  }'
```

**기대 결과**:
```
- ✅ 전체 트랜잭션 롤백
- ✅ 프로젝트 생성되지 않음
- ✅ 부분적 데이터 삽입 없음
- ✅ 적절한 에러 메시지 반환
```

## 4. 외부 의존성 에러 테스트

### 4.1 제3자 서비스 에러

#### 테스트 케이스 4.1.1: GitHub API 연동 실패
**시나리오**: GitHub 링크 검증 시 GitHub API 응답 실패

**테스트 방법**:
```bash
# GitHub API 요청 제한 또는 잘못된 토큰 사용
# Network 차단으로 외부 API 접근 불가 시뮬레이션
```

**기대 결과**:
```
- ✅ GitHub 링크 검증 실패 시에도 프로젝트 생성 진행
- ✅ 경고 메시지와 함께 저장
- ✅ 나중에 다시 검증할 수 있는 옵션 제공
```

## 5. 사용자 입력 검증 에러

### 5.1 XSS 및 보안 검증

#### 테스트 케이스 5.1.1: 악성 스크립트 입력
**시나리오**: 프로젝트 설명에 스크립트 태그 삽입 시도

**테스트 요청**:
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<script>alert(\"XSS\")</script>",
    "summary": "정상 요약",
    "description": "<img src=x onerror=alert(1)>",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30"
  }'
```

**기대 결과**:
```
- ✅ HTML 태그가 이스케이프되어 저장
- ✅ 스크립트 실행 방지
- ✅ 프론트엔드에서도 추가 이스케이프 처리
```

### 5.2 SQL Injection 방지

#### 테스트 케이스 5.2.1: SQL 인젝션 시도
**시나리오**: 검색 파라미터에 SQL 구문 삽입

**테스트 요청**:
```bash
curl -X GET "http://localhost:8080/api/projects?techStacks='; DROP TABLE projects; --"
```

**기대 결과**:
```
- ✅ JPA/Hibernate의 PreparedStatement 사용으로 방지
- ✅ 파라미터가 문자열로 처리됨
- ✅ 데이터베이스에 영향 없음
```

## 6. 성능 관련 에러

### 6.1 메모리 부족

#### 테스트 케이스 6.1.1: 대용량 데이터 처리
**시나리오**: 매우 큰 페이지 사이즈 요청

**테스트 요청**:
```bash
curl -X GET "http://localhost:8080/api/projects?size=1000000"
```

**기대 결과**:
```
- ✅ 최대 페이지 사이즈 제한 (예: 100)
- ✅ 적절한 에러 메시지 반환
- ✅ 서버 메모리 보호
```

### 6.2 응답 시간 초과

#### 테스트 케이스 6.2.1: 복잡한 쿼리 처리
**시나리오**: 매우 복잡한 필터링 조건

**테스트 요청**:
```bash
curl -X GET "http://localhost:8080/api/projects?techStacks=React,Vue,Angular,Spring,Django,Express&year=2024"
```

**기대 결과**:
```
- ✅ 쿼리 최적화로 합리적 응답 시간 유지
- ✅ 타임아웃 설정으로 무한 대기 방지
- ✅ 필요시 캐싱 적용
```

## 7. Error Boundary 및 Global Error Handler 테스트

### 7.1 Frontend Error Boundary

#### 테스트 케이스 7.1.1: React Error Boundary
**테스트 코드**:
```typescript
// 의도적 에러 발생 컴포넌트
const ErrorComponent = () => {
  throw new Error("테스트 에러");
  return <div>Never rendered</div>;
};
```

**기대 결과**:
```
- ✅ Error Boundary가 에러 catch
- ✅ 에러 정보 로깅
- ✅ 사용자 친화적 에러 UI 표시
- ✅ 에러 리포팅 서비스 연동 (추후)
```

### 7.2 Backend Global Exception Handler

#### 테스트 케이스 7.2.1: 예상치 못한 예외
**테스트 방법**:
```java
@RestController
public class TestController {
    @GetMapping("/test-exception")
    public String testException() {
        throw new NullPointerException("예상치 못한 에러");
    }
}
```

**기대 응답**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "예상치 못한 오류가 발생했습니다.",
    "timestamp": "2024-08-11T12:00:00Z",
    "traceId": "abc123"
  }
}
```

## 8. 모니터링 및 알림 테스트

### 8.1 에러 로깅

#### 테스트 케이스 8.1.1: 에러 로그 기록
**검증 항목**:
```
- ✅ 에러 로그 파일 생성
- ✅ 로그 레벨 적절히 설정
- ✅ 스택 트레이스 포함
- ✅ 요청 컨텍스트 정보 포함
- ✅ 개인정보 마스킹 처리
```

### 8.2 Health Check

#### 테스트 케이스 8.2.1: 시스템 상태 확인
**테스트 요청**:
```bash
curl -X GET "http://localhost:8080/actuator/health"
```

**기대 응답**:
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"}
  }
}
```

## 테스트 실행 체크리스트

### Frontend Error Handling
- [ ] API 통신 에러 처리
- [ ] JavaScript 런타임 에러 처리
- [ ] 라우팅 에러 처리
- [ ] 404 페이지 표시
- [ ] 사용자 친화적 에러 메시지

### Backend Error Handling  
- [ ] HTTP 상태 코드 적절한 사용
- [ ] 일관된 에러 응답 형식
- [ ] 데이터 검증 에러 처리
- [ ] 보안 관련 입력 검증
- [ ] Global Exception Handler 동작

### Database Error Handling
- [ ] 연결 에러 처리
- [ ] 제약 조건 위반 처리
- [ ] 트랜잭션 롤백 테스트
- [ ] 쿼리 성능 및 타임아웃

### Integration Error Handling
- [ ] Frontend-Backend 에러 전파
- [ ] 네트워크 에러 복구
- [ ] 부분 실패 시나리오 처리

## 테스트 결과 기록

| 에러 타입 | 테스트 케이스 | 실행일시 | 결과 | 사용자 경험 | 개발자 정보 | 개선 필요 |
|-----------|---------------|----------|------|-------------|-------------|-----------|
| API 통신 | 1.1.1 | | | | | |
| 404 처리 | 1.3.1 | | | | | |
| 데이터 검증 | 2.2.1 | | | | | |
| DB 제약조건 | 3.2.2 | | | | | |
| XSS 방지 | 5.1.1 | | | | | |

## 에러 처리 품질 기준

1. **사용자 경험**: 에러가 발생해도 사용자가 당황하지 않도록
2. **정보 제공**: 문제 해결을 위한 구체적인 안내
3. **보안**: 시스템 내부 정보 노출 방지
4. **복구 가능성**: 사용자가 에러 상황에서 벗어날 수 있는 방법 제공
5. **개발자 지원**: 문제 진단을 위한 충분한 로그 정보

## 최종 검증 기준

✅ **에러 커버리지**: 모든 주요 에러 시나리오 테스트됨  
✅ **사용자 친화성**: 기술적 에러를 이해하기 쉬운 언어로 변환  
✅ **보안 강화**: 악의적 입력에 대한 적절한 방어  
✅ **시스템 안정성**: 에러 발생 시에도 시스템 전체 다운 방지  
✅ **개발 효율성**: 에러 추적 및 디버깅이 용이함
