# 데이터베이스 CRUD 테스트

## 목적
데이터베이스 레이어에서 모든 CRUD 연산이 올바르게 동작하고 데이터 무결성이 유지되는지 검증

## 테스트 환경
- Database: H2 (개발용 In-Memory)
- JPA/Hibernate ORM
- Spring Data JPA Repositories
- 트랜잭션 관리

## 1. Projects 엔티티 CRUD 테스트

### 1.1 Create (생성) 테스트

**기능 요구사항**: 새로운 프로젝트를 생성할 수 있어야 함

#### 테스트 케이스 1.1.1: 기본 프로젝트 생성
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 프로젝트",
    "summary": "테스트용 프로젝트입니다",
    "description": "상세한 프로젝트 설명",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "githubUrl": "https://github.com/test/project",
    "demoUrl": "https://test-project.com",
    "techStackIds": [1, 2, 3],
    "academicIds": [1, 2]
  }'
```

**데이터베이스 검증 포인트**:
- [ ] Project 테이블에 새 레코드 삽입됨
- [ ] project_tech_stacks 연결 테이블에 관계 생성됨
- [ ] project_academics 연결 테이블에 관계 생성됨
- [ ] 생성일시(createdAt) 자동 설정됨
- [ ] ID 자동 증가됨

#### 테스트 케이스 1.1.2: 필수 필드 누락 시 검증
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "제목이 없는 프로젝트"
  }'
```

**기대 결과**: 
- 400 Bad Request
- 적절한 유효성 검증 에러 메시지
- 데이터베이스에 불완전한 데이터 삽입되지 않음

### 1.2 Read (조회) 테스트

#### 테스트 케이스 1.2.1: 단일 프로젝트 조회
```bash
curl -X GET "http://localhost:8080/api/projects/1"
```

**데이터베이스 검증 포인트**:
- [ ] 프로젝트 기본 정보 조회됨
- [ ] 연관된 기술 스택 목록 Lazy Loading 됨
- [ ] 연관된 학업 정보 목록 Lazy Loading 됨
- [ ] N+1 쿼리 문제 없음 (Fetch Join 사용)

#### 테스트 케이스 1.2.2: 페이징 조회
```bash
curl -X GET "http://localhost:8080/api/projects?page=1&size=5&sort=endDate,desc"
```

**데이터베이스 검증 포인트**:
- [ ] LIMIT, OFFSET 쿼리 적용됨
- [ ] 정렬 조건 적용됨
- [ ] 총 레코드 수 카운트 쿼리 실행됨
- [ ] 메모리 효율적인 페이징 처리

#### 테스트 케이스 1.2.3: 필터링 조회
```bash
curl -X GET "http://localhost:8080/api/projects?techStacks=React,Spring Boot"
```

**데이터베이스 검증 포인트**:
- [ ] JOIN 쿼리로 기술 스택 필터링
- [ ] IN 절 또는 EXISTS 절 사용
- [ ] 중복 제거 (DISTINCT)
- [ ] 인덱스 활용 확인

### 1.3 Update (수정) 테스트

#### 테스트 케이스 1.3.1: 프로젝트 정보 수정
```bash
curl -X PUT "http://localhost:8080/admin/projects/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 프로젝트 제목",
    "summary": "수정된 요약",
    "description": "수정된 상세 설명",
    "startDate": "2024-02-01",
    "endDate": "2024-07-31",
    "githubUrl": "https://github.com/updated/project",
    "demoUrl": "https://updated-project.com",
    "techStackIds": [1, 3, 4],
    "academicIds": [2]
  }'
```

**데이터베이스 검증 포인트**:
- [ ] 기본 필드들이 UPDATE 됨
- [ ] 기존 기술 스택 관계 삭제 후 새 관계 생성
- [ ] 기존 학업 관계 삭제 후 새 관계 생성
- [ ] 수정일시(updatedAt) 자동 갱신됨
- [ ] 트랜잭션 일관성 유지됨

#### 테스트 케이스 1.3.2: 부분 수정
```bash
curl -X PUT "http://localhost:8080/admin/projects/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "제목만 수정",
    "summary": "기존 요약 유지",
    "techStackIds": []
  }'
```

**데이터베이스 검증 포인트**:
- [ ] 지정된 필드만 수정됨
- [ ] 빈 배열 전송 시 모든 관계 삭제됨
- [ ] NULL 허용 필드 적절히 처리됨

### 1.4 Delete (삭제) 테스트

#### 테스트 케이스 1.4.1: 프로젝트 삭제
```bash
curl -X DELETE "http://localhost:8080/admin/projects/1"
```

**데이터베이스 검증 포인트**:
- [ ] 프로젝트 레코드 삭제됨
- [ ] 연관 테이블 레코드들 CASCADE 삭제됨
- [ ] 외래 키 제약 조건 준수됨
- [ ] 논리 삭제 vs 물리 삭제 정책 적용됨

## 2. Academics 엔티티 CRUD 테스트

### 2.1 Create 테스트

#### 테스트 케이스 2.1.1: 학업 정보 생성
```bash
curl -X POST "http://localhost:8080/admin/academics" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 과목",
    "semester": "2024 SPR",
    "grade": "HIGH DISTINCTION",
    "description": "테스트용 과목 설명",
    "creditPoints": 6,
    "marks": 95,
    "status": "completed"
  }'
```

**데이터베이스 검증 포인트**:
- [ ] Academic 테이블에 레코드 삽입
- [ ] Enum 값(status, grade) 올바르게 저장
- [ ] 숫자 필드(creditPoints, marks) 타입 검증
- [ ] 유니크 제약 조건 검증 (name + semester)

### 2.2 Read 테스트

#### 테스트 케이스 2.2.1: 학기별 필터링
```bash
curl -X GET "http://localhost:8080/api/academics?semester=2025%20AUT"
```

**데이터베이스 검증 포인트**:
- [ ] WHERE 절 조건 적용
- [ ] 문자열 매칭 정확성
- [ ] 대소문자 구분 처리

#### 테스트 케이스 2.2.2: 상태별 필터링
```bash
curl -X GET "http://localhost:8080/api/academics?status=completed"
```

**데이터베이스 검증 포인트**:
- [ ] Enum 필드 필터링
- [ ] 인덱스 활용 확인

### 2.3 Update 테스트

#### 테스트 케이스 2.3.1: 성적 업데이트
```bash
curl -X PUT "http://localhost:8080/admin/academics/6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Data Structures and Algorithms",
    "semester": "2025 AUT",
    "grade": "HIGH DISTINCTION",
    "description": "Updated description",
    "creditPoints": 6,
    "marks": 95,
    "status": "completed"
  }'
```

**데이터베이스 검증 포인트**:
- [ ] 기존 레코드 수정됨
- [ ] 동시성 제어 (Optimistic Locking)
- [ ] 트랜잭션 격리 수준 유지

### 2.4 Delete 테스트

#### 테스트 케이스 2.4.1: 학업 정보 삭제
```bash
curl -X DELETE "http://localhost:8080/admin/academics/1"
```

**데이터베이스 검증 포인트**:
- [ ] Academic 레코드 삭제
- [ ] 프로젝트와의 관계 처리 (CASCADE vs RESTRICT)

## 3. TechStacks 엔티티 CRUD 테스트

### 3.1 Create 테스트

#### 테스트 케이스 3.1.1: 기술 스택 생성
```bash
curl -X POST "http://localhost:8080/admin/tech-stacks" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vue.js",
    "type": "FRONTEND"
  }'
```

**데이터베이스 검증 포인트**:
- [ ] TechStack 테이블에 레코드 삽입
- [ ] 이름 유니크 제약 조건 확인
- [ ] Enum 타입 검증

### 3.2 Read 테스트

#### 테스트 케이스 3.2.1: 타입별 조회
```bash
curl -X GET "http://localhost:8080/api/techstacks?type=BACKEND"
```

**데이터베이스 검증 포인트**:
- [ ] Enum 필드 필터링
- [ ] 알파벳 순 정렬

### 3.3 Delete 테스트

#### 테스트 케이스 3.3.1: 기술 스택 삭제
```bash
curl -X DELETE "http://localhost:8080/admin/tech-stacks/1"
```

**데이터베이스 검증 포인트**:
- [ ] 사용 중인 기술 스택 삭제 시 제약 조건 확인
- [ ] 연관 프로젝트 있을 시 에러 처리

## 4. 관계형 데이터 무결성 테스트

### 4.1 외래 키 제약 조건 테스트

#### 테스트 케이스 4.1.1: 존재하지 않는 기술 스택 참조
```bash
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "잘못된 프로젝트",
    "summary": "존재하지 않는 기술 스택 참조",
    "techStackIds": [999]
  }'
```

**기대 결과**: 외래 키 제약 조건 위반 에러

### 4.2 다대다 관계 테스트

#### 테스트 케이스 4.2.1: 프로젝트-기술스택 관계
```sql
-- 직접 데이터베이스 쿼리로 확인
SELECT p.title, ts.name, ts.type 
FROM projects p
JOIN project_tech_stacks pts ON p.id = pts.project_id
JOIN tech_stacks ts ON pts.tech_stack_id = ts.id
WHERE p.id = 1;
```

**검증 포인트**:
- [ ] 중간 테이블 올바르게 생성됨
- [ ] 복합 기본 키 설정됨
- [ ] 중복 관계 방지됨

## 5. 트랜잭션 테스트

### 5.1 롤백 테스트

#### 테스트 케이스 5.1.1: 부분 실패 시 롤백
```bash
# 의도적으로 실패하는 요청
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "롤백 테스트",
    "techStackIds": [1, 999]
  }'
```

**검증 포인트**:
- [ ] 전체 트랜잭션 롤백됨
- [ ] 부분 데이터 삽입되지 않음
- [ ] 데이터베이스 일관성 유지됨

## 6. 성능 테스트

### 6.1 쿼리 성능 테스트

#### 테스트 케이스 6.1.1: N+1 문제 확인
```bash
# 프로젝트 목록 조회 시 쿼리 수 확인
curl -X GET "http://localhost:8080/api/projects?page=1&size=10"
```

**검증 포인트**:
- [ ] SQL 로그 확인
- [ ] Fetch Join 사용됨
- [ ] 쿼리 수 최적화됨

### 6.2 인덱스 활용 테스트

#### 테스트 케이스 6.2.1: 자주 사용되는 필터링 필드
```sql
-- 실행 계획 확인
EXPLAIN SELECT * FROM projects WHERE end_date > '2024-01-01';
EXPLAIN SELECT * FROM academics WHERE semester = '2025 AUT';
```

**검증 포인트**:
- [ ] 인덱스 스캔 사용됨
- [ ] Full Table Scan 없음

## 테스트 실행 체크리스트

- [ ] H2 Console 접속 확인 (http://localhost:8080/h2-console)
- [ ] 모든 테이블 스키마 확인
- [ ] Create 테스트 전체 실행
- [ ] Read 테스트 전체 실행
- [ ] Update 테스트 전체 실행
- [ ] Delete 테스트 전체 실행
- [ ] 제약 조건 테스트 실행
- [ ] 트랜잭션 테스트 실행
- [ ] 성능 테스트 실행

## 테스트 결과 기록

| 테스트 케이스 | 실행일시 | 결과 | SQL 쿼리 수 | 응답시간(ms) | 비고 |
|---------------|----------|------|-------------|--------------|------|
| 1.1.1 | | | | | |
| 1.1.2 | | | | | |
| 1.2.1 | | | | | |
| 1.2.2 | | | | | |
| 1.2.3 | | | | | |
| 1.3.1 | | | | | |
| 1.3.2 | | | | | |
| 1.4.1 | | | | | |

## 검증 완료 기준

1. **기능적 요구사항**: 모든 CRUD 연산이 기대한 대로 동작
2. **데이터 무결성**: 제약 조건과 관계 규칙 준수
3. **성능**: 허용 가능한 응답 시간과 쿼리 최적화
4. **트랜잭션**: ACID 속성 보장
5. **에러 처리**: 예외 상황에서 적절한 처리
