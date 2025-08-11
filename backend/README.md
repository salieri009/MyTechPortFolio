# MyPortfolio Backend

Spring Boot 기반의 포트폴리오 웹사이트 백엔드 API 서버

## 🚀 기술 스택

- **Java 17**
- **Spring Boot 3.3.5**
- **Spring Data JPA**
- **H2 Database** (개발용)
- **MySQL** (운영용)
- **Gradle** (빌드 도구)
- **SpringDoc OpenAPI** (API 문서화)

## 📁 프로젝트 구조

```
src/main/java/com/mytechfolio/portfolio/
├── PortfolioApplication.java          # 메인 애플리케이션 클래스
├── config/
│   ├── CorsConfig.java               # CORS 설정
│   └── DataInitializer.java          # 초기 데이터 설정
├── controller/
│   ├── ProjectController.java        # 프로젝트 API 컨트롤러
│   ├── AcademicController.java       # 학업 API 컨트롤러
│   └── TechStackController.java      # 기술스택 API 컨트롤러
├── domain/
│   ├── Project.java                  # 프로젝트 엔티티
│   ├── Academic.java                 # 학업 엔티티
│   └── TechStack.java                # 기술스택 엔티티
├── dto/
│   ├── request/
│   │   ├── ProjectCreateRequest.java
│   │   └── ProjectUpdateRequest.java
│   └── response/
│       ├── ApiResponse.java          # 공통 API 응답 래퍼
│       ├── PageResponse.java         # 페이징 응답
│       ├── ProjectSummaryResponse.java
│       ├── ProjectDetailResponse.java
│       ├── AcademicResponse.java
│       └── TechStackResponse.java
├── exception/
│   └── GlobalExceptionHandler.java   # 전역 예외 처리
├── repository/
│   ├── ProjectRepository.java        # 프로젝트 리포지토리
│   ├── AcademicRepository.java       # 학업 리포지토리
│   └── TechStackRepository.java      # 기술스택 리포지토리
└── service/
    ├── ProjectService.java           # 프로젝트 서비스
    ├── AcademicService.java          # 학업 서비스
    └── TechStackService.java         # 기술스택 서비스
```

## 🗄️ 데이터베이스 스키마

### 주요 엔티티

1. **Project (프로젝트)**
   - 프로젝트 정보 (제목, 요약, 설명, 기간 등)
   - 기술 스택과 다대다 관계
   - 학업 과정과 다대다 관계

2. **TechStack (기술 스택)**
   - 기술 이름, 타입, 아이콘 URL
   - 타입: Frontend, Backend, DB, DevOps, Other

3. **Academic (학업 과정)**
   - 과목명, 학기, 교수, 설명

## 🛠️ 주요 기능

### 프로젝트 관리
- ✅ 프로젝트 목록 조회 (페이징, 정렬, 필터링)
- ✅ 프로젝트 상세 조회
- ✅ 프로젝트 생성, 수정, 삭제
- ✅ 기술 스택별 필터링
- ✅ 연도별 필터링

### 학업 과정 관리
- ✅ 학업 과정 목록 조회 (페이징)
- ✅ 학업 과정 상세 조회
- ✅ 학기별 필터링

### 기술 스택 관리
- ✅ 기술 스택 목록 조회
- ✅ 타입별 필터링

## 🔧 실행 방법

### 1. 사전 요구사항
- Java 17+
- Gradle 7.0+ (또는 gradlew 사용)

### 2. 애플리케이션 실행

```bash
# 개발 모드로 실행
./gradlew bootRun

# 또는 JAR 빌드 후 실행
./gradlew build
java -jar build/libs/portfolio-0.0.1-SNAPSHOT.jar
```

### 3. 접속 정보
- **애플리케이션**: http://localhost:8080
- **API 문서 (Swagger)**: http://localhost:8080/swagger-ui.html
- **H2 콘솔**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (비어있음)

## 📚 API 엔드포인트

### 프로젝트 API
- `GET /api/projects` - 프로젝트 목록 조회
- `GET /api/projects/{id}` - 프로젝트 상세 조회
- `POST /api/projects` - 프로젝트 생성
- `PUT /api/projects/{id}` - 프로젝트 수정
- `DELETE /api/projects/{id}` - 프로젝트 삭제

### 학업 과정 API
- `GET /api/academics` - 학업 과정 목록 조회
- `GET /api/academics/{id}` - 학업 과정 상세 조회

### 기술 스택 API
- `GET /api/techstacks` - 기술 스택 목록 조회

## 🔄 초기 데이터

애플리케이션 시작 시 다음 데이터가 자동으로 생성됩니다:
- **기술 스택**: React, Spring Boot, Java, MySQL 등 22개
- **학업 과정**: 웹 프로그래밍, 데이터베이스 설계 등 4개
- **프로젝트**: 포트폴리오 웹사이트, 할일 관리 앱 등 3개

## ⚙️ 설정

### application.yml
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driverClassName: org.h2.Driver
    username: sa
    password: 
  
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    
  h2:
    console:
      enabled: true
```

## 🚨 주요 특징

1. **RESTful API 설계**: 일관된 API 설계 패턴 적용
2. **페이징 및 정렬**: 대용량 데이터 처리를 위한 페이징 지원
3. **필터링**: 다양한 조건으로 데이터 필터링 가능
4. **예외 처리**: 전역 예외 처리로 일관된 에러 응답
5. **API 문서화**: SpringDoc을 통한 자동 API 문서 생성
6. **CORS 설정**: 프론트엔드와의 연동을 위한 CORS 설정
7. **초기 데이터**: 개발 및 테스트를 위한 샘플 데이터 자동 생성

## 🔗 프론트엔드 연동

프론트엔드 애플리케이션에서는 `http://localhost:8080/api`를 base URL로 사용하여 API를 호출할 수 있습니다.

CORS가 모든 origin에 대해 허용되도록 설정되어 있어, 로컬 개발 환경에서 자유롭게 테스트 가능합니다.

## 📝 개발 노트

이 백엔드는 `design-plan/` 폴더의 설계 문서를 바탕으로 구현되었습니다:
- **API 설계**: `api-design.md`
- **백엔드 설계**: `backend-design.md`
- **아키텍처 설계**: `architecture-design.md`

모든 API는 설계 문서의 스펙을 따르며, 프론트엔드에서 정의된 인터페이스와 호환됩니다.
