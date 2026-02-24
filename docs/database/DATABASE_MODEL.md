# Database Model 설계서

## 1. 설계 원칙

- **Database:** MongoDB 7.0
- **ODM:** Spring Data MongoDB 3.3.4
- **Database Name:** `portfolio` (환경변수 `MONGODB_URI`로 설정)
- **ID 전략:** MongoDB ObjectId (24자 hex 문자열, `String` 타입으로 매핑)
- **타임스탬프:** 모든 컬렉션에 `createdAt`, `updatedAt` 필드 필수 (`LocalDateTime`)
- **Soft Delete:** 미사용 — 물리 삭제 방식
- **참조 패턴:** Embedded Reference (ObjectId 배열로 M:N 관계 표현)
- **Enum 처리:** Java Enum → MongoDB String 저장
- **인덱스:** `@Indexed`, `@Indexed(unique=true)` 어노테이션으로 선언

---

## 2. 컬렉션 관계 다이어그램

```
projects ──┬── techStackIds[] ──────→ tech_stacks
           ├── relatedAcademicIds[] ──→ academics
           └── (1:N) ──→ project_engagement
                     ──→ project_media

testimonials ──── projectId ──→ projects (선택적)
contacts ──── projectId ──→ projects (선택적)
users (독립)
resumes (독립)
journey_milestones (독립)
admin_users (독립)
```

---

## 3. 컬렉션 정의

### 3.1 projects

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| title | String | 프로젝트명, NOT NULL |
| summary | String | 짧은 요약 |
| description | String | 상세 설명 (Markdown 지원) |
| startDate | LocalDate | 시작일 |
| endDate | LocalDate | 종료일 |
| githubUrl | String | GitHub 저장소 URL |
| demoUrl | String | 데모 사이트 URL |
| repositoryName | String | GitHub 저장소명 |
| isFeatured | Boolean | Home 노출 여부, DEFAULT: false |
| status | String (Enum) | 프로젝트 상태, DEFAULT: COMPLETED |
| viewCount | Long | 조회수, DEFAULT: 0 |
| techStackIds | List\<String\> | TechStack ObjectId 배열 |
| relatedAcademicIds | List\<String\> | Academic ObjectId 배열 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**status 값:**
- `PLANNING`: 기획 단계
- `IN_PROGRESS`: 개발 진행 중
- `COMPLETED`: 완료
- `ARCHIVED`: 보관

---

### 3.2 academics

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| subjectCode | String | 과목 코드, @Indexed |
| name | String | 과목명 |
| semester | String | 학기 정보 (예: "2025 AUT") |
| grade | String (Enum) | 성적 |
| creditPoints | Integer | 학점 |
| marks | Integer | 점수 |
| description | String | 과목 설명 |
| status | String (Enum) | 이수 상태 |
| year | Integer | 학년도 |
| semesterType | String (Enum) | 학기 구분 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**grade 값:**
- `HIGH_DISTINCTION` (HD): 최우수
- `DISTINCTION` (D): 우수
- `CREDIT` (C): 양호
- `PASS` (P): 통과

**status 값:**
- `COMPLETED`: 이수 완료
- `ENROLLED`: 수강 중
- `EXEMPTION`: 면제

**semesterType 값:**
- `SPRING` (SPR): 봄 학기
- `AUTUMN` (AUT): 가을 학기

---

### 3.3 tech_stacks

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| name | String | 기술명, @Indexed(unique=true) |
| type | String (Enum) | 기술 카테고리 |
| logoUrl | String | 로고 이미지 URL |
| officialUrl | String | 공식 사이트 URL |
| description | String | 기술 설명 |
| proficiencyLevel | String (Enum) | 숙련도, DEFAULT: INTERMEDIATE |
| usageCount | Long | 사용 프로젝트 수, DEFAULT: 0 |
| isPrimary | Boolean | 주력 기술 여부, DEFAULT: false |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**type 값:**
- `FRONTEND`: 프론트엔드
- `BACKEND`: 백엔드
- `DATABASE`: 데이터베이스
- `DEVOPS`: DevOps
- `MOBILE`: 모바일
- `TESTING`: 테스팅
- `OTHER`: 기타

**proficiencyLevel 값:**
- `BEGINNER` (Lv.1): 초급
- `INTERMEDIATE` (Lv.2): 중급
- `ADVANCED` (Lv.3): 고급
- `EXPERT` (Lv.4): 전문가

**캐싱:** Spring Cache + Caffeine, TTL 1시간

---

### 3.4 users

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| email | String | 이메일, @Indexed(unique=true) |
| password | String | BCrypt 해시 비밀번호 |
| displayName | String | 표시명 |
| name | String | 호환성 필드 |
| profileImageUrl | String | 프로필 이미지 URL |
| role | String (Enum) | 역할, DEFAULT: USER |
| enabled | Boolean | 활성화 여부, DEFAULT: true |
| isEmailVerified | Boolean | 이메일 인증 여부, DEFAULT: false |
| oauthProvider | String | OAuth 제공자 ("google", "github") |
| oauthId | String | OAuth 제공자 ID |
| twoFactorEnabled | Boolean | 2FA 활성화 여부, DEFAULT: false |
| twoFactorSecret | String | 2FA 시크릿 (TOTP) |
| lastLogin | LocalDateTime | 마지막 로그인 |
| sessionId | String | 현재 세션 ID |
| lastActivity | LocalDateTime | 마지막 활동 |
| deviceFingerprint | String | 디바이스 핑거프린트 |
| roles | List\<String\> | 다중 역할 목록 |
| registrationSource | String | 가입 소스 |
| referrer | String | 유입 경로 |
| userAgent | String | User Agent |
| ipAddress | String | IP 주소 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**role 값:**
- `USER`: 일반 사용자
- `ADMIN`: 관리자
- `RECRUITER`: 채용담당자
- `GUEST`: 게스트

---

### 3.5 testimonials

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| authorName | String | 작성자 이름 |
| authorTitle | String | 직함 |
| authorCompany | String | 회사명 |
| authorEmail | String | 이메일 |
| authorLinkedInUrl | String | LinkedIn URL |
| content | String | 추천사 내용 |
| rating | Integer | 평점 (1~5) |
| type | String (Enum) | 추천사 유형 |
| source | String (Enum) | 출처 |
| linkedInRecommendationId | String | LinkedIn 추천 ID |
| linkedInProfileUrl | String | LinkedIn 프로필 URL |
| isActive | Boolean | 활성화 여부, DEFAULT: true |
| isFeatured | Boolean | 주요 표시 여부, DEFAULT: false |
| displayOrder | Integer | 표시 순서 |
| isApproved | Boolean | 승인 여부, DEFAULT: true |
| internalNotes | String | 내부 노트 |
| projectId | String | 관련 프로젝트 ObjectId (선택적) |
| testimonialDate | LocalDateTime | 추천일 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**type 값:**
- `CLIENT`: 클라이언트
- `COLLEAGUE`: 동료
- `MENTOR`: 멘토
- `PROFESSOR`: 교수
- `OTHER`: 기타

**source 값:**
- `LINKEDIN`: LinkedIn에서 수집
- `EMAIL`: 이메일로 수집
- `MANUAL`: 수동 입력
- `OTHER`: 기타

---

### 3.6 contacts

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| email | String | 발신자 이메일, @Indexed |
| name | String | 발신자 이름 |
| company | String | 회사명 |
| subject | String | 제목 |
| message | String | 메시지 내용 |
| phoneNumber | String | 전화번호 |
| linkedInUrl | String | LinkedIn URL |
| jobTitle | String | 직책 |
| referrer | String | 유입 경로 |
| source | String | 연락 소스 |
| projectId | String | 관련 프로젝트 ObjectId (선택적) |
| ipAddress | String | 해시된 IP 주소 |
| userAgent | String | User Agent |
| status | String (Enum) | 연락 상태, DEFAULT: NEW |
| isSpam | Boolean | 스팸 여부, DEFAULT: false |
| isRead | Boolean | 읽음 여부, DEFAULT: false |
| isReplied | Boolean | 답변 여부, DEFAULT: false |
| internalNotes | String | 내부 노트 |
| createdAt | LocalDateTime | 제출일시 |
| readAt | LocalDateTime | 읽은 일시 |
| repliedAt | LocalDateTime | 답변 일시 |

**status 값:**
- `NEW`: 새 연락
- `READ`: 읽음
- `REPLIED`: 답변 완료
- `ARCHIVED`: 보관
- `SPAM`: 스팸

---

### 3.7 journey_milestones

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| year | String | 연도/범위, @Indexed |
| title | String | 제목, @Indexed |
| description | String | 상세 설명 |
| icon | String | 아이콘 식별자 |
| techStack | List\<String\> | 관련 기술명 목록 |
| status | String (Enum) | 마일스톤 상태, DEFAULT: COMPLETED |
| technicalComplexity | Integer | 기술 복잡도 (1~5), DEFAULT: 1 |
| projectCount | Integer | 프로젝트 수, DEFAULT: 0 |
| codeMetrics | CodeMetrics | 코드 메트릭 (Embedded) |
| keyAchievements | List\<KeyAchievement\> | 주요 성과 (Embedded 배열) |
| skillProgression | List\<SkillLevel\> | 기술 숙련 진행 (Embedded 배열) |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**Embedded: CodeMetrics**
```json
{
  "linesOfCode": 50000,
  "commits": 1200,
  "repositories": 15
}
```

**Embedded: KeyAchievement**
```json
{
  "title": "클라우드 마이그레이션 완료",
  "description": "온프레미스에서 Azure로 전체 이전",
  "impact": "운영 비용 40% 절감"
}
```

**Embedded: SkillLevel**
```json
{
  "name": "React",
  "level": 4,
  "category": "FRONTEND"
}
```

**status 값:**
- `COMPLETED`: 완료된 마일스톤
- `CURRENT`: 현재 진행 중
- `PLANNED`: 향후 계획

---

### 3.8 resumes

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| version | String | 이력서 버전, @Indexed |
| title | String | 이력서 제목 |
| description | String | 용도 설명 |
| fileName | String | 원본 파일명 |
| fileUrl | String | 파일 URL (Azure Blob Storage) |
| fileType | String | 파일 타입 ("pdf", "docx") |
| fileSize | Long | 파일 크기 (bytes) |
| isActive | Boolean | 활성화 여부, DEFAULT: true |
| isPublic | Boolean | 공개 여부, DEFAULT: true |
| downloadCount | Long | 다운로드 수, DEFAULT: 0 |
| metaDescription | String | SEO 메타 설명 |
| keywords | String | 키워드 (콤마 구분) |
| previousVersionId | String | 이전 버전 ObjectId |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |
| lastDownloadedAt | LocalDateTime | 마지막 다운로드 일시 |

---

### 3.9 project_engagement

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| projectId | String | 프로젝트 ObjectId |
| sessionId | String | 세션 ID |
| visitorId | String | 방문자 ID |
| viewDuration | Long | 조회 시간 (초) |
| scrollDepth | Integer | 스크롤 깊이 (0~100%) |
| githubLinkClicked | Boolean | GitHub 링크 클릭 여부 |
| demoLinkClicked | Boolean | Demo 링크 클릭 여부 |
| timesViewed | Integer | 세션 내 조회 횟수 |
| referrer | String | 유입 경로 |
| source | String | 소스 유형 ("direct", "search", "social", "referral") |
| userAgent | String | User Agent |
| deviceType | String | 디바이스 유형 ("mobile", "tablet", "desktop") |
| browser | String | 브라우저 |
| country | String | 국가 (Geo IP) |
| city | String | 도시 (Geo IP) |
| ipAddress | String | 해시된 IP 주소 |
| viewedAt | LocalDateTime | 조회 일시 |
| lastInteractionAt | LocalDateTime | 마지막 상호작용 일시 |

---

### 3.10 project_media

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| projectId | String | 프로젝트 ObjectId, @Indexed |
| fileName | String | 원본 파일명 |
| fileUrl | String | 파일 URL |
| thumbnailUrl | String | 썸네일 URL |
| fileType | String | 파일 유형 카테고리 ("image", "video", "document") |
| mimeType | String | MIME 타입 |
| fileSize | Long | 파일 크기 (bytes) |
| type | String (Enum) | 미디어 분류 |
| displayOrder | Integer | 갤러리 표시 순서 |
| altText | String | 접근성 대체 텍스트 |
| caption | String | 캡션 |
| description | String | 설명 |
| width | Integer | 이미지/영상 너비 (px) |
| height | Integer | 이미지/영상 높이 (px) |
| duration | Integer | 영상 길이 (초) |
| storageProvider | String | 스토리지 제공자 ("azure", "local", "s3") |
| storagePath | String | 스토리지 경로 |
| isActive | Boolean | 활성화 여부, DEFAULT: true |
| isPrimary | Boolean | 대표 이미지 여부, DEFAULT: false |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**type 값:**
- `SCREENSHOT`: 스크린샷
- `LOGO`: 로고
- `VIDEO`: 영상
- `DOCUMENT`: 문서
- `DIAGRAM`: 다이어그램
- `OTHER`: 기타

---

### 3.11 admin_users

| 컬럼 | 타입 | 설명 |
|------|------|------|
| _id | String (ObjectId) | PK |
| username | String | 관리자 사용자명, @Indexed(unique=true) |
| password | String | BCrypt 해시 비밀번호 |
| email | String | 이메일, @Indexed(unique=true) |
| fullName | String | 전체 이름 |
| role | String (Enum) | 관리자 역할, DEFAULT: VIEWER |
| enabled | Boolean | 활성화, DEFAULT: true |
| accountNonExpired | Boolean | 계정 만료 여부, DEFAULT: true |
| accountNonLocked | Boolean | 계정 잠금 여부, DEFAULT: true |
| credentialsNonExpired | Boolean | 자격증명 만료 여부, DEFAULT: true |
| lastLoginAt | LocalDateTime | 마지막 로그인 |
| oauthProvider | String | OAuth 제공자 |
| oauthId | String | OAuth ID |
| profileImageUrl | String | 프로필 이미지 |
| twoFactorEnabled | Boolean | 2FA 활성화, DEFAULT: false |
| twoFactorSecret | String | 2FA 시크릿 |
| sessionId | String | 세션 ID |
| lastActivity | LocalDateTime | 마지막 활동 |
| deviceFingerprint | String | 디바이스 핑거프린트 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

**role 값 (AdminRole):**
- `SUPER_ADMIN` (Level 100): 전체 시스템 관리자 — 모든 권한
- `ADMIN` (Level 80): 일반 관리자 — system.config, system.backup 제외
- `CONTENT_MANAGER` (Level 60): 콘텐츠 관리자 — content.*, media.*, project.* 권한
- `VIEWER` (Level 20): 조회 전용 — .read, .view 권한만

---

## 4. 인덱스 가이드

### 4.1 Unique 인덱스

| 컬렉션 | 필드 | 비고 |
|--------|------|------|
| tech_stacks | name | 기술명 중복 방지 |
| users | email | 이메일 중복 방지 |
| admin_users | username | 사용자명 중복 방지 |
| admin_users | email | 이메일 중복 방지 |

### 4.2 일반 인덱스

| 컬렉션 | 필드 | 용도 |
|--------|------|------|
| academics | subjectCode | 과목 코드 검색 |
| contacts | email | 발신자 이메일 검색 |
| journey_milestones | year | 연도별 조회 |
| journey_milestones | title | 제목 검색 |
| project_media | projectId | 프로젝트별 미디어 조회 |
| resumes | version | 버전별 조회 |

### 4.3 권장 복합 인덱스

| 컬렉션 | 인덱스 | 용도 |
|--------|--------|------|
| projects | (status, endDate DESC) | 상태별 최신순 조회 |
| projects | (isFeatured, status) | Featured 프로젝트 조회 |
| academics | (year, semesterType) | 학기별 조회 |
| project_engagement | (projectId, viewedAt DESC) | 프로젝트별 최근 방문 |
| contacts | (status, createdAt DESC) | 상태별 최신 연락 |
| testimonials | (isActive, isFeatured) | 활성 Featured 추천사 |

---

## 5. 데이터 접근 패턴

- **Repository:** `MongoRepository<T, String>` 확장
- **Custom Query:** `@Query` 어노테이션으로 복잡한 쿼리 정의
- **Aggregation:** 분석용 MongoDB Aggregation Pipeline 사용
- **Pagination:** Spring Data의 `Pageable` 인터페이스 활용
- **Caching:** TechStack 서비스에 Caffeine 캐시 적용 (TTL: 1시간)

## 6. 유효성 검증

### 6.1 커스텀 Validator 어노테이션

| 어노테이션 | 설명 |
|-----------|------|
| @ValidMongoId | ObjectId 형식 검증 (24자 hex) |
| @ValidMongoIdList | ObjectId 목록 각 항목 검증 |
| @ValidUrl | URL 형식 검증 |
| @ValidDateRange | 날짜 범위 유효성 검증 (start <= end) |

### 6.2 Jakarta Bean Validation

- `@NotBlank`: 필수 문자열 필드
- `@Size(min, max)`: 문자열 길이 제한
- `@Email`: 이메일 형식
- `@Min/@Max`: 숫자 범위
- `@Pattern`: 정규식 패턴
