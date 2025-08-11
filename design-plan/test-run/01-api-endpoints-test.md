# API 엔드포인트 테스트

## 목적
모든 REST API 엔드포인트가 기능 요구사항에 따라 정상 작동하는지 검증

## 테스트 환경
- Backend Server: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- 테스트 도구: Postman, curl, 또는 브라우저 DevTools

## 1. Projects API 테스트

### 1.1 프로젝트 목록 조회 (GET /api/projects)

**기능 요구사항**: 사용자가 프로젝트 목록을 페이징과 필터링으로 조회할 수 있어야 함

#### 테스트 케이스 1.1.1: 기본 목록 조회
```bash
curl -X GET "http://localhost:8080/api/projects?page=1&size=10" \
  -H "accept: application/json"
```

**기대 결과**:
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 3,
    "totalPages": 1,
    "items": [
      {
        "id": 1,
        "title": "Portfolio Website",
        "summary": "개인 포트폴리오 웹사이트",
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "techStacks": ["React", "TypeScript", "Spring Boot"]
      }
    ]
  },
  "error": null
}
```

#### 테스트 케이스 1.1.2: 기술 스택 필터링
```bash
curl -X GET "http://localhost:8080/api/projects?techStacks=React,TypeScript" \
  -H "accept: application/json"
```

**기대 결과**: React 또는 TypeScript를 사용한 프로젝트만 반환

#### 테스트 케이스 1.1.3: 연도 필터링
```bash
curl -X GET "http://localhost:8080/api/projects?year=2024" \
  -H "accept: application/json"
```

**기대 결과**: 2024년 프로젝트만 반환

#### 테스트 케이스 1.1.4: 정렬 옵션
```bash
curl -X GET "http://localhost:8080/api/projects?sort=endDate,desc" \
  -H "accept: application/json"
```

**기대 결과**: 종료일 기준 내림차순 정렬

### 1.2 프로젝트 상세 조회 (GET /api/projects/{id})

#### 테스트 케이스 1.2.1: 유효한 ID로 조회
```bash
curl -X GET "http://localhost:8080/api/projects/1" \
  -H "accept: application/json"
```

**기대 결과**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Portfolio Website",
    "summary": "개인 포트폴리오 웹사이트",
    "description": "React와 Spring Boot를 사용한 현대적인 포트폴리오...",
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "githubUrl": "https://github.com/username/portfolio",
    "demoUrl": "https://portfolio.example.com",
    "techStacks": ["React", "TypeScript", "Spring Boot"],
    "relatedAcademics": ["Web Systems", "Software Architecture"]
  },
  "error": null
}
```

#### 테스트 케이스 1.2.2: 존재하지 않는 ID로 조회
```bash
curl -X GET "http://localhost:8080/api/projects/999" \
  -H "accept: application/json"
```

**기대 결과**: 404 상태 코드와 적절한 에러 메시지

## 2. Academics API 테스트

### 2.1 학업 목록 조회 (GET /api/academics)

**기능 요구사항**: 사용자가 학업 성과를 학기별로 조회할 수 있어야 함

#### 테스트 케이스 2.1.1: 전체 학업 목록 조회
```bash
curl -X GET "http://localhost:8080/api/academics?page=1&size=20" \
  -H "accept: application/json"
```

**기대 결과**:
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 20,
    "total": 19,
    "items": [
      {
        "id": 1,
        "name": "Advanced Software Development",
        "semester": "2025 SPR",
        "grade": null,
        "description": "Advanced concepts in software development...",
        "creditPoints": 6,
        "marks": null,
        "status": "enrolled"
      },
      {
        "id": 6,
        "name": "Data Structures and Algorithms",
        "semester": "2025 AUT",
        "grade": "HIGH DISTINCTION",
        "description": "Advanced data structures...",
        "creditPoints": 6,
        "marks": 92,
        "status": "completed"
      }
    ]
  },
  "error": null
}
```

#### 테스트 케이스 2.1.2: 학기별 필터링
```bash
curl -X GET "http://localhost:8080/api/academics?semester=2025%20AUT" \
  -H "accept: application/json"
```

**기대 결과**: 2025 AUT 학기 과목만 반환

### 2.2 학업 상세 조회 (GET /api/academics/{id})

#### 테스트 케이스 2.2.1: 유효한 ID로 조회
```bash
curl -X GET "http://localhost:8080/api/academics/6" \
  -H "accept: application/json"
```

**기대 결과**: 해당 학업의 상세 정보와 관련 프로젝트 목록

## 3. TechStacks API 테스트

### 3.1 기술 스택 목록 조회 (GET /api/techstacks)

#### 테스트 케이스 3.1.1: 전체 기술 스택 조회
```bash
curl -X GET "http://localhost:8080/api/techstacks" \
  -H "accept: application/json"
```

**기대 결과**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "React",
      "type": "FRONTEND"
    },
    {
      "id": 2,
      "name": "Spring Boot",
      "type": "BACKEND"
    }
  ],
  "error": null
}
```

#### 테스트 케이스 3.1.2: 타입별 필터링
```bash
curl -X GET "http://localhost:8080/api/techstacks?type=FRONTEND" \
  -H "accept: application/json"
```

**기대 결과**: Frontend 기술 스택만 반환

## 4. Admin API 테스트 (선택적)

### 4.1 데이터 초기화 (POST /admin/reset-data)

#### 테스트 케이스 4.1.1: 데이터 리셋
```bash
curl -X POST "http://localhost:8080/admin/reset-data" \
  -H "accept: application/json"
```

**기대 결과**: 모든 데이터가 초기화되고 샘플 데이터가 재생성됨

## 테스트 실행 체크리스트

- [ ] Backend 서버 시작 확인
- [ ] Swagger UI 접속 확인
- [ ] Projects API 모든 케이스 실행
- [ ] Academics API 모든 케이스 실행
- [ ] TechStacks API 모든 케이스 실행
- [ ] Admin API 테스트 (선택적)
- [ ] 에러 케이스 검증
- [ ] CORS 설정 검증

## 검증 포인트

1. **응답 형식**: 모든 API가 일관된 ApiResponse 형식을 사용하는가?
2. **상태 코드**: 적절한 HTTP 상태 코드를 반환하는가?
3. **페이징**: 페이징 파라미터가 올바르게 동작하는가?
4. **필터링**: 모든 필터 옵션이 정상 작동하는가?
5. **검증**: 잘못된 입력에 대해 적절한 에러를 반환하는가?
6. **CORS**: Frontend에서 API 호출이 가능한가?

## 테스트 결과 기록

| 테스트 케이스 | 실행일시 | 결과 | 비고 |
|---------------|----------|------|------|
| 1.1.1 | | | |
| 1.1.2 | | | |
| 1.1.3 | | | |
| 1.1.4 | | | |
| 1.2.1 | | | |
| 1.2.2 | | | |
| 2.1.1 | | | |
| 2.1.2 | | | |
| 2.2.1 | | | |
| 3.1.1 | | | |
| 3.1.2 | | | |
| 4.1.1 | | | |
