
# API 기획안 (API Design Plan)

## 1. 개요 (Overview)

프론트엔드와 백엔드 간의 데이터 통신을 위한 RESTful API 명세를 정의합니다. 모든 요청과 응답은 JSON 형식을 기본으로 사용하며, 일관성 있는 API 구조를 통해 개발 효율성을 높이는 것을 목표로 합니다.

- **Base URL**: `/api`
- **인증**: 별도의 인증 없이 모든 API는 공개 상태로 설정 (추후 관리자 기능 추가 시 Spring Security를 통한 JWT 인증 도입 고려)
- **공통 응답 형식**:
    ```json
    {
      "success": true,
      "data": { ... },
      "error": null
    }
    ```
    - `success`: `true` 또는 `false`로 요청 성공 여부 표시
    - `data`: 요청 성공 시 전달할 데이터 객체
    - `error`: 요청 실패 시 에러 메시지 또는 코드

## 2. API 명세: Projects

### `[GET] /api/projects`

모든 프로젝트 목록을 조회합니다.

- **Query Parameters**:
    - `tech_stack` (optional, `String`): 특정 기술 스택을 포함하는 프로젝트만 필터링
    - `sort` (optional, `String`, `desc` or `asc`): `end_date` (개발 종료일) 기준으로 정렬
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "My Tech Folio",
          "summary": "나만의 역량을 담은 포트폴리오 허브",
          "startDate": "2023-01-01",
          "endDate": "2023-03-31",
          "techStacks": ["Spring Boot", "React", "AWS"]
        }
      ],
      "error": null
    }
    ```

### `[GET] /api/projects/{id}`

특정 ID를 가진 프로젝트의 상세 정보를 조회합니다.

- **Path Variable**:
    - `id` (`Long`): 조회할 프로젝트의 고유 ID
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "My Tech Folio",
        "summary": "...",
        "description": "## 프로젝트 개요\n...",
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "githubUrl": "https://github.com/...",
        "demoUrl": "https://...",
        "techStacks": ["Spring Boot", "React", "AWS"],
        "relatedAcademics": ["데이터베이스", "객체지향프로그래밍"]
      },
      "error": null
    }
    ```
- **Error Response (404 Not Found)**: 해당 ID의 프로젝트가 없을 경우.

### `[POST] /api/projects` (관리자용)

새로운 프로젝트를 추가합니다.

- **Request Body**:
    ```json
    {
      "title": "New Awesome Project",
      "summary": "...",
      "description": "...",
      "startDate": "2024-01-01",
      "endDate": "2024-02-29",
      "githubUrl": "...",
      "techStackIds": [1, 3, 5],
      "academicIds": [2, 4]
    }
    ```
- **Success Response (201 Created)**: 생성된 프로젝트의 상세 정보 반환.

### `[PUT] /api/projects/{id}` (관리자용)

특정 프로젝트 정보를 수정합니다.

- **Request Body**: `[POST]`와 동일
- **Success Response (200 OK)**: 수정된 프로젝트의 상세 정보 반환.

### `[DELETE] /api/projects/{id}` (관리자용)

특정 프로젝트를 삭제합니다.

- **Success Response (204 No Content)**

## 3. API 명세: Academics

### `[GET] /api/academics`

모든 수강 과목 목록을 조회합니다.

- **Query Parameters**:
    - `semester` (optional, `String`): 특정 학기 과목만 필터링 (예: "2-1")
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "자료구조",
          "semester": "2학년 1학기",
          "grade": "A+"
        }
      ],
      "error": null
    }
    ```

### `[GET] /api/academics/{id}`

특정 ID를 가진 수강 과목의 상세 정보를 조회합니다. (연관된 프로젝트 포함)

- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "자료구조",
        "semester": "2학년 1학기",
        "description": "...",
        "relatedProjects": [
          {
            "id": 5,
            "title": "알고리즘 문제 풀이 저장소"
          }
        ]
      },
      "error": null
    }
    ```

## 4. API 명세: Tech Stacks

### `[GET] /api/tech-stacks`

모든 기술 스택 목록을 조회합니다.

- **Query Parameters**:
    - `type` (optional, `String`): 'Backend', 'Frontend' 등 타입별 필터링
- **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        { "id": 1, "name": "Java", "type": "Backend" },
        { "id": 2, "name": "React", "type": "Frontend" }
      ],
      "error": null
    }
    ```
