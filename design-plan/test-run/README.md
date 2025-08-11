# 테스트 실행 계획 (Test Execution Plan)

## 개요

이 디렉토리는 MyTechPortfolio 프로젝트의 기능 요구사항에 따른 체계적인 테스트 실행 계획을 포함합니다. 각 테스트는 frontend-backend 연동, database 검증, API 엔드포인트 테스트를 포괄합니다.

## 테스트 환경

- **Frontend**: React 18 + TypeScript + Vite (http://localhost:5174)
- **Backend**: Spring Boot 3.1.5 + JPA (http://localhost:8080)
- **Database**: H2 (개발용), PostgreSQL (프로덕션용)
- **API Documentation**: Swagger UI (http://localhost:8080/swagger-ui.html)

## 테스트 실행 순서

1. [API 엔드포인트 테스트](./01-api-endpoints-test.md)
2. [데이터베이스 CRUD 테스트](./02-database-crud-test.md)
3. [Frontend-Backend 연동 테스트](./03-integration-test.md)
4. [사용자 시나리오 테스트](./04-user-scenario-test.md)
5. [에러 핸들링 테스트](./05-error-handling-test.md)
6. [성능 및 부하 테스트](./06-performance-test.md)

## 테스트 결과 기록

각 테스트 실행 후 결과를 `test-results/` 디렉토리에 기록합니다.

- 성공 ✅: 모든 기대값이 충족됨
- 실패 ❌: 기대값 불충족 또는 오류 발생
- 보류 ⏸️: 의존성 문제로 테스트 미실행

## 기능 요구사항 매핑

| 기능 | 테스트 파일 | 우선순위 |
|------|-------------|----------|
| 프로젝트 목록 조회 | 01, 03, 04 | High |
| 프로젝트 상세 조회 | 01, 03, 04 | High |
| 학업 정보 조회 | 01, 03, 04 | High |
| 기술 스택 필터링 | 01, 03, 04 | Medium |
| 반응형 디자인 | 04, 06 | Medium |
| 다국어 지원 | 04 | Low |
| 관리자 기능 | 01, 02, 05 | Low |
