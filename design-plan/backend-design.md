
# 백엔드 기획안 (Backend Design Plan)

## 1. 개요 (Overview)

안정적이고 확장 가능한 API 서버를 구축하여 프론트엔드에 필요한 데이터를 원활하게 제공하는 것을 목표로 합니다. Java와 Spring Boot 생태계를 적극 활용하여 생산성과 품질을 모두 확보합니다.

- **핵심 기술**: **Spring Boot**
- **선택 이유**:
    - **강력한 생태계**: Spring Data, Spring Security 등 다양한 프로젝트와 쉽게 통합하여 필요한 기능을 빠르게 구현할 수 있습니다.
    - **독립 실행 가능**: 내장 WAS(Tomcat)를 통해 별도의 웹 서버 설정 없이 단일 JAR 파일로 간편하게 배포하고 실행할 수 있습니다.
    - **높은 생산성**: 복잡한 설정을 자동화하여 개발자가 비즈니스 로직에만 집중할 수 있도록 지원합니다.

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 | 내용 |
| --- | --- | --- |
| **Framework** | Spring Boot 3.x | `Spring Web`, `Spring Data JPA` 등 핵심 모듈 사용 |
| **Language** | Java 17 | LTS 버전으로 안정성 확보 및 최신 Java 문법 활용 |
| **Database** | H2 / MySQL | 개발 단계에서는 빠른 실행을 위해 H2 사용, 배포 시에는 AWS RDS(MySQL)로 전환 |
| **ORM** | Spring Data JPA (Hibernate) | 객체-관계 매핑으로 생산성 및 유지보수성 향상 |
| **Build Tool** | Gradle | 간결한 Groovy/Kotlin DSL 기반의 빌드 자동화 도구 |
| **API Docs** | Springdoc (Swagger) | API 명세를 자동으로 생성하고 UI를 통해 테스트 환경 제공 |
| **Utilities** | Lombok | `@Getter`, `@Builder` 등 어노테이션으로 Boilerplate 코드 제거 |

## 3. 데이터베이스 설계 (Database Schema)

### 가. `Project` 테이블

프로젝트 정보를 저장하는 테이블입니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | `BIGINT` | `PK`, `Auto Increment` | 프로젝트 고유 ID |
| `title` | `VARCHAR(255)` | `Not Null` | 프로젝트 제목 |
| `summary` | `VARCHAR(500)`| `Not Null` | 한 줄 요약 |
| `description` | `TEXT` | `Not Null` | 상세 설명 (마크다운 형식 지원) |
| `start_date`| `DATE` | `Not Null` | 개발 시작일 |
| `end_date` | `DATE` | `Not Null` | 개발 종료일 |
| `github_url`| `VARCHAR(255)`| | GitHub 저장소 주소 |
| `demo_url` | `VARCHAR(255)`| | 라이브 데모 주소 |
| `created_at`| `DATETIME` | `Not Null` | 생성 일시 |
| `updated_at`| `DATETIME` | `Not Null` | 수정 일시 |

### 나. `Academic` 테이블

수강 과목 정보를 저장하는 테이블입니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | `BIGINT` | `PK`, `Auto Increment` | 과목 고유 ID |
| `name` | `VARCHAR(255)` | `Not Null` | 과목명 (예: 자료구조) |
| `semester` | `VARCHAR(100)`| `Not Null` | 수강 학기 (예: 2학년 1학기) |
| `grade` | `VARCHAR(10)` | | 받은 성적 (예: A+) |
| `description` | `TEXT` | | 과목에 대한 간략한 설명 |
| `created_at`| `DATETIME` | `Not Null` | 생성 일시 |
| `updated_at`| `DATETIME` | `Not Null` | 수정 일시 |

### 다. `Project_Academic` 테이블 (매핑 테이블)

`Project`와 `Academic`의 다대다(N:M) 관계를 연결합니다. 하나의 과목에서 여러 프로젝트가 나올 수 있고, 하나의 프로젝트가 여러 과목과 연관될 수 있습니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `project_id`| `BIGINT` | `FK (Project.id)` | 프로젝트 ID |
| `academic_id`| `BIGINT` | `FK (Academic.id)` | 과목 ID |

### 라. `TechStack` 테이블

기술 스택 정보를 저장합니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | `BIGINT` | `PK`, `Auto Increment` | 기술 스택 고유 ID |
| `name` | `VARCHAR(100)` | `Not Null`, `Unique` | 기술 이름 (예: Spring Boot) |
| `type` | `VARCHAR(50)` | `Not Null` | 기술 분류 (예: Backend, Frontend, DB) |
| `logo_url` | `VARCHAR(255)`| | 기술 로고 이미지 주소 |

### 마. `Project_TechStack` 테이블 (매핑 테이블)

`Project`와 `TechStack`의 다대다(N:M) 관계를 연결합니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `project_id`| `BIGINT` | `FK (Project.id)` | 프로젝트 ID |
| `tech_stack_id`| `BIGINT`| `FK (TechStack.id)`| 기술 스택 ID |

## 4. 패키지 구조 (Package Structure)

```
com.mytechfolio
`-- portfolio
    |-- config/           # 설정 클래스 (Security, Swagger 등)
    |-- controller/       # API 엔드포인트를 정의하는 컨트롤러
    |   |-- ProjectController.java
    |   `-- AcademicController.java
    |-- domain/           # JPA 엔티티(도메인 객체)
    |   |-- Project.java
    |   |-- Academic.java
    |   `-- TechStack.java
    |-- dto/              # 데이터 전송 객체 (Request/Response)
    |   |-- request/
    |   `-- response/
    |-- repository/       # Spring Data JPA 리포지토리 인터페이스
    |   |-- ProjectRepository.java
    |   `-- AcademicRepository.java
    |-- service/          # 비즈니스 로직을 처리하는 서비스
    |   |-- ProjectService.java
    |   `-- AcademicService.java
    `-- PortfolioApplication.java # 메인 애플리케이션 클래스
```
