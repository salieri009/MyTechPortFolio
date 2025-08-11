# Frontend-Backend 연동 테스트

## 목적
Frontend React 애플리케이션과 Backend Spring Boot API 간의 완전한 연동이 정상 작동하는지 검증

## 테스트 환경
- Frontend: http://localhost:5174 (Vite Dev Server)
- Backend: http://localhost:8080 (Spring Boot)
- Proxy 설정: vite.config.ts에서 /api 요청을 백엔드로 프록시
- CORS: Backend에서 허용된 Origin 설정

## 1. 환경 설정 검증

### 1.1 서버 시작 확인
```bash
# Backend 시작
cd backend
./gradlew bootRun

# Frontend 시작 (새 터미널)
cd frontend
npm run dev
```

### 1.2 Proxy 설정 확인

**vite.config.ts 검증**:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

**테스트**: 브라우저 DevTools Network 탭에서 API 요청 URL 확인
- 요청: `http://localhost:5174/api/projects`
- 실제 전송: `http://localhost:8080/api/projects`

### 1.3 CORS 설정 확인

**Backend Controller 검증**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
```

**테스트**: 브라우저 Console에서 CORS 에러 없음을 확인

## 2. Projects 페이지 연동 테스트

### 2.1 프로젝트 목록 로딩 테스트

**테스트 시나리오**:
1. 브라우저에서 http://localhost:5174/projects 접속
2. 페이지 로딩 확인
3. DevTools Network 탭에서 API 호출 확인

**기대 결과**:
- ✅ Projects 페이지가 로딩됨
- ✅ `GET /api/projects` 요청 전송됨  
- ✅ Mock 데이터 대신 실제 API 응답 표시됨
- ✅ 로딩 상태 적절히 표시됨

#### 테스트 케이스 2.1.1: 초기 로딩
```javascript
// 브라우저 Console에서 확인
fetch('/api/projects?page=1&size=10')
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('Error:', error));
```

#### 테스트 케이스 2.1.2: 프로젝트 카드 렌더링
**검증 포인트**:
- [ ] 각 프로젝트가 카드 형태로 표시됨
- [ ] 제목, 요약, 기간이 올바르게 표시됨
- [ ] 기술 스택 태그들이 표시됨
- [ ] 반응형 그리드 레이아웃 적용됨

### 2.2 필터링 기능 연동 테스트

#### 테스트 케이스 2.2.1: 기술 스택 필터링
**테스트 시나리오**:
1. React 태그 클릭
2. URL 쿼리 파라미터 변경 확인
3. 새로운 API 요청 전송 확인
4. 필터링된 결과 표시 확인

**기대 결과**:
```
요청: GET /api/projects?techStacks=React
응답: React를 사용한 프로젝트만 표시
UI: React 태그가 선택 상태로 하이라이트
```

#### 테스트 케이스 2.2.2: 연도 필터링
**테스트 시나리오**:
1. 연도 선택 드롭다운에서 "2024" 선택
2. API 요청 확인
3. 결과 필터링 확인

**기대 결과**:
```
요청: GET /api/projects?year=2024
응답: 2024년 완료된 프로젝트만 표시
```

#### 테스트 케이스 2.2.3: 정렬 기능
**테스트 시나리오**:
1. "Oldest First" 태그 클릭
2. API 요청 확인
3. 정렬 순서 변경 확인

**기대 결과**:
```
요청: GET /api/projects?sort=endDate,asc
응답: 종료일 기준 오름차순 정렬된 프로젝트
UI: 프로젝트 카드 순서 변경됨
```

### 2.3 프로젝트 상세 페이지 연동 테스트

#### 테스트 케이스 2.3.1: 상세 페이지 네비게이션
**테스트 시나리오**:
1. 프로젝트 카드 클릭
2. `/projects/{id}` 페이지로 라우팅
3. 상세 API 호출 확인
4. 상세 정보 표시 확인

**기대 결과**:
```
요청: GET /api/projects/1
응답: 프로젝트 상세 정보
UI: 제목, 설명, GitHub/Demo 링크, 기술 스택, 관련 학업 표시
```

## 3. Academics 페이지 연동 테스트

### 3.1 학업 정보 로딩 테스트

#### 테스트 케이스 3.1.1: 전체 학업 목록
**테스트 시나리오**:
1. http://localhost:5174/academics 접속
2. 학업 성과 데이터 로딩 확인
3. 통계 정보 계산 확인

**기대 결과**:
- ✅ 총 Credit Points: 96+
- ✅ GPA: 5.88
- ✅ WAM: 78.62
- ✅ 학기별 그룹화 표시
- ✅ 성적별 색상 코딩

#### 테스트 케이스 3.1.2: 학업 성과 카드 렌더링
**검증 포인트**:
- [ ] 과목명이 올바르게 표시됨
- [ ] 학기 정보가 표시됨
- [ ] 성적 배지가 적절한 색상으로 표시됨
- [ ] 상태 배지 (enrolled, completed, exemption) 표시됨
- [ ] Credit Points와 점수 표시됨

### 3.2 실제 성적 데이터 연동

#### 테스트 케이스 3.2.1: 제공된 성적표 데이터 확인
**검증할 실제 데이터**:
```json
{
  "name": "Data Structures and Algorithms",
  "semester": "2025 AUT", 
  "grade": "HIGH DISTINCTION",
  "marks": 92,
  "creditPoints": 6,
  "status": "completed"
}
```

**API 요청 검증**:
```bash
curl -X GET "http://localhost:8080/api/academics" | grep "Data Structures"
```

## 4. 에러 핸들링 연동 테스트

### 4.1 네트워크 에러 처리

#### 테스트 케이스 4.1.1: Backend 서버 중단 시나리오
**테스트 시나리오**:
1. Backend 서버 중단
2. Frontend에서 페이지 새로고침
3. 에러 처리 확인

**기대 결과**:
- ✅ 로딩 상태에서 에러 상태로 전환
- ✅ 사용자 친화적 에러 메시지 표시
- ✅ Mock 데이터로 fallback (선택적)

#### 테스트 케이스 4.1.2: 404 에러 처리
**테스트 시나리오**:
1. 존재하지 않는 프로젝트 ID로 접근
2. `/projects/999` 접속
3. 404 에러 처리 확인

**기대 결과**:
```
API 응답: 404 Not Found
UI: "프로젝트를 찾을 수 없습니다" 메시지 표시
```

### 4.2 데이터 형식 에러 처리

#### 테스트 케이스 4.2.1: 잘못된 API 응답 형식
**테스트 시나리오**:
1. API 응답 형식이 예상과 다른 경우 처리
2. TypeScript 타입 에러 확인

## 5. 실시간 업데이트 테스트

### 5.1 데이터 동기화 테스트

#### 테스트 케이스 5.1.1: Admin API를 통한 데이터 변경
**테스트 시나리오**:
1. Admin API로 새 프로젝트 생성
2. Frontend 페이지 새로고침
3. 새 데이터 반영 확인

```bash
# 1. 새 프로젝트 생성
curl -X POST "http://localhost:8080/admin/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "실시간 테스트 프로젝트",
    "summary": "연동 테스트용",
    "startDate": "2024-08-01",
    "endDate": "2024-12-31",
    "techStackIds": [1, 2]
  }'

# 2. Frontend에서 확인
# http://localhost:5174/projects 새로고침
```

## 6. 성능 연동 테스트

### 6.1 로딩 성능 테스트

#### 테스트 케이스 6.1.1: 초기 페이지 로드 시간
**측정 항목**:
- [ ] Time to First Byte (TTFB)
- [ ] First Contentful Paint (FCP)
- [ ] API 응답 시간
- [ ] 총 페이지 로드 시간

**성능 기준**:
- API 응답 시간: < 500ms
- 초기 페이지 로드: < 2초
- 상호작용까지 시간: < 3초

#### 테스트 케이스 6.1.2: 대용량 데이터 처리
**테스트 시나리오**:
1. 많은 수의 프로젝트/학업 데이터 로드
2. 가상화 또는 페이징 처리 확인
3. 메모리 사용량 모니터링

## 7. 반응형 연동 테스트

### 7.1 모바일 환경 테스트

#### 테스트 케이스 7.1.1: 모바일 브라우저에서 API 호출
**테스트 환경**:
- Chrome DevTools 모바일 에뮬레이션
- 실제 모바일 기기
- 다양한 화면 크기 (320px ~ 1920px)

**검증 포인트**:
- [ ] 모든 API 요청이 정상 작동
- [ ] 터치 인터페이스에서 필터링 동작
- [ ] 반응형 레이아웃 적용

## 8. 국제화(i18n) 연동 테스트

### 8.1 다국어 지원 테스트

#### 테스트 케이스 8.1.1: 언어 변경 시 API 데이터 처리
**테스트 시나리오**:
1. 한국어/영어 언어 변경
2. API 데이터는 동일하게 유지
3. UI 텍스트만 변경됨 확인

## 테스트 실행 체크리스트

- [ ] Backend 서버 정상 시작 (포트 8080)
- [ ] Frontend 서버 정상 시작 (포트 5174)
- [ ] Proxy 설정 동작 확인
- [ ] CORS 에러 없음 확인
- [ ] Projects 페이지 완전 연동 테스트
- [ ] Academics 페이지 완전 연동 테스트
- [ ] 에러 핸들링 테스트
- [ ] 성능 테스트
- [ ] 반응형 테스트
- [ ] 다국어 테스트

## 자동화된 연동 테스트 스크립트

### E2E 테스트 시나리오 (Playwright)

```typescript
// tests/integration/projects.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Projects Integration', () => {
  test('should load projects from API', async ({ page }) => {
    await page.goto('http://localhost:5174/projects');
    
    // API 요청 인터셉트
    const apiResponse = await page.waitForResponse(
      response => response.url().includes('/api/projects') && response.status() === 200
    );
    
    expect(apiResponse.ok()).toBeTruthy();
    
    // 프로젝트 카드 로딩 확인
    await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible();
  });

  test('should filter projects by tech stack', async ({ page }) => {
    await page.goto('http://localhost:5174/projects');
    
    // React 태그 클릭
    await page.click('text=React');
    
    // 필터링 API 요청 확인
    await page.waitForResponse(
      response => response.url().includes('techStacks=React')
    );
    
    // 필터링된 결과 확인
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toContainText('React');
  });
});
```

## 테스트 결과 기록

| 테스트 케이스 | 실행일시 | Frontend | Backend | API 응답시간 | 결과 | 비고 |
|---------------|----------|----------|---------|--------------|------|------|
| 2.1.1 | | ✅ | ✅ | 250ms | ✅ | |
| 2.1.2 | | | | | | |
| 2.2.1 | | | | | | |
| 2.2.2 | | | | | | |
| 2.2.3 | | | | | | |
| 2.3.1 | | | | | | |
| 3.1.1 | | | | | | |
| 3.1.2 | | | | | | |
| 4.1.1 | | | | | | |
| 4.1.2 | | | | | | |

## 연동 완료 기준

1. **데이터 흐름**: Frontend ↔ Backend 데이터 흐름 완전 작동
2. **에러 처리**: 모든 에러 시나리오에서 적절한 사용자 경험
3. **성능**: 허용 가능한 응답 시간과 사용자 경험
4. **일관성**: 전체 애플리케이션에서 일관된 동작
5. **확장성**: 새로운 기능 추가 시 기존 연동에 영향 없음
