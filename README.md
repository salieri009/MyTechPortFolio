# MyTechPortfolio 🚀

> **세련되고 미래지향적인 개인 포트폴리오 웹사이트**  
> React TypeScript + Spring Boot로 구축된 풀스택 포트폴리오 애플리케이션

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 📋 프로젝트 개요

MyTechPortfolio는 개인의 기술적 역량과 학업 성과를 효과적으로 보여주는 포트폴리오 웹사이트입니다. 채용담당자의 관점에서 최적화된 UX/UI와 comprehensive한 테스팅 프레임워크를 제공합니다.

### ✨ 주요 특징

- 🎨 **미래지향적 디자인**: 글래스모피즘과 네오모피즘을 활용한 세련된 UI
- 📱 **완전 반응형**: 모바일 퍼스트 설계로 모든 디바이스 지원
- 🌙 **다크/라이트 모드**: 사용자 선호에 따른 테마 전환
- 📊 **실시간 데이터**: 학업 성과 및 프로젝트 진행 상황 시각화
- 🔍 **채용자 최적화**: 채용담당자가 빠르게 핵심 정보를 파악할 수 있는 구조
- 🧪 **종합 테스팅**: API, 데이터베이스, 통합, 성능 테스트 프레임워크

---

## 🏗️ 프로젝트 구조

```
MyTechPortfolio/
├── 📁 frontend/                   # React + TypeScript + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── 📁 pages/             # 페이지 컴포넌트
│   │   ├── 📁 styles/            # 글로벌 테마 및 스타일
│   │   ├── 📁 types/             # TypeScript 타입 정의
│   │   └── 📁 utils/             # 유틸리티 함수
├── 📁 backend/                    # Spring Boot + JPA + H2
│   ├── 📁 src/main/java/         # Java 소스 코드
│   │   ├── 📁 controller/        # REST API 컨트롤러
│   │   ├── 📁 service/           # 비즈니스 로직
│   │   ├── 📁 repository/        # 데이터 액세스 계층
│   │   ├── 📁 domain/            # JPA 엔티티
│   │   └── 📁 config/            # 설정 및 초기화
├── 📁 design-plan/               # 설계 문서 및 계획
│   ├── 📁 test-run/              # 종합 테스팅 문서
│   └── 📄 recruiter-focus-elements.md  # 채용담당자 중심 최적화 가이드
└── 📄 README.md                  # 프로젝트 문서
```

---

## 🚀 빠른 시작

### 📋 사전 요구사항

- **Node.js** 18.0.0 이상
- **Java** 17 이상
- **Git** 2.30 이상

### 1️⃣ 프로젝트 클론

```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio
```

### 2️⃣ 백엔드 실행

```bash
cd backend
./gradlew bootRun
# Windows: gradlew.bat bootRun
```

🌐 백엔드 서버: http://localhost:8080  
📊 H2 Database Console: http://localhost:8080/h2-console  
📚 API 문서 (Swagger): http://localhost:8080/swagger-ui.html

### 3️⃣ 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

🌐 프론트엔드 서버: http://localhost:5174

---

## 📈 현재 구현 상태

### ✅ 완료된 기능

- [x] **학업 성과 시스템**: UTS 실제 성적 데이터 통합 (GPA 5.88, WAM 78.62)
- [x] **프로젝트 쇼케이스**: 7개 실제 프로젝트 상세 정보
- [x] **기술 스택 관리**: 20+ 기술 스택 로고 및 분류
- [x] **미래지향적 UI/UX**: 글래스모피즘 디자인 시스템
- [x] **반응형 디자인**: 모바일-퍼스트 레이아웃
- [x] **종합 테스팅 문서**: 6개 카테고리별 상세 테스트 계획

### 🔄 진행 중

- [ ] **백엔드 API 통합**: 프론트엔드-백엔드 연동
- [ ] **성능 최적화**: Core Web Vitals 개선
- [ ] **SEO 최적화**: 메타 태그 및 구조화된 데이터

### 📅 계획 중

- [ ] **CI/CD 파이프라인**: GitHub Actions 자동 배포
- [ ] **모니터링 시스템**: 사용자 행동 분석
- [ ] **PWA 기능**: 오프라인 지원 및 앱 설치

---

## 🎯 핵심 기능

### 📊 학업 성과 대시보드
- **실시간 GPA/WAM 계산**: 5.88/7.0, 78.62% 표시
- **학기별 성과 추이**: 2023-2025년 성적 변화 시각화
- **과목별 상세 정보**: 19개 과목 완료/진행/면제 상태

### 💼 프로젝트 포트폴리오
- **기술별 필터링**: React, Spring Boot, TypeScript 등
- **진행 상황 추적**: 완료/진행중 프로젝트 구분
- **GitHub 연동**: 실제 레포지토리 링크
- **라이브 데모**: 배포된 프로젝트 체험

### 🛠️ 기술 스택 시각화
- **숙련도 표시**: 각 기술별 경험 수준
- **카테고리 분류**: Frontend/Backend/Database/DevOps
- **트렌드 분석**: 최신 기술 스택 채택률

---

## 🧪 테스팅 프레임워크

MyTechPortfolio는 포괄적인 테스팅 전략을 제공합니다:

| 테스트 유형 | 범위 | 도구 |
|-------------|------|------|
| **API 엔드포인트** | REST API 기능 검증 | curl, Postman |
| **데이터베이스 CRUD** | JPA 엔티티 무결성 | H2 Console, JUnit |
| **프론트엔드-백엔드 통합** | 전체 데이터 흐름 | Cypress, Jest |
| **사용자 시나리오** | End-to-End 사용성 | 페르소나 기반 테스트 |
| **에러 핸들링** | 예외 상황 대응 | 의도적 오류 발생 |
| **성능 최적화** | Core Web Vitals | Lighthouse, WebPageTest |

### 📋 테스트 실행 가이드

```bash
# 백엔드 테스트
cd backend
./gradlew test

# 프론트엔드 테스트  
cd frontend
npm run test
npm run test:e2e

# 성능 테스트
npm run lighthouse
npm run bundle-analyzer
```

---

## 🌐 브랜치 전략

```
master              # 🏭 프로덕션 배포
├── dev             # 🔧 개발 통합
│   ├── frontend-dev    # ⚛️ 프론트엔드 개발
│   ├── backend-dev     # ☕ 백엔드 개발
│   └── planning        # 📋 기획 및 문서화
└── hotfix          # 🚨 긴급 수정
```

### 🔄 개발 워크플로우

1. **기능 개발**: `feature/기능명` 브랜치에서 개발
2. **통합 테스트**: `dev` 브랜치에서 기능 통합
3. **품질 검증**: 테스팅 프레임워크로 검증
4. **프로덕션 배포**: `master` 브랜치로 병합

---

## 📊 기술 스택

### 🎨 프론트엔드

| 기술 | 버전 | 목적 |
|------|------|------|
| **React** | 18.2.0 | UI 라이브러리 |
| **TypeScript** | 5.0 | 타입 안전성 |
| **Vite** | 4.4.0 | 빌드 도구 |
| **Styled Components** | 6.0 | CSS-in-JS |
| **React Router** | 6.14 | 라우팅 |

### ⚙️ 백엔드

| 기술 | 버전 | 목적 |
|------|------|------|
| **Spring Boot** | 3.1.5 | 웹 프레임워크 |
| **Java** | 17 | 프로그래밍 언어 |
| **Spring Data JPA** | 3.1.5 | ORM |
| **H2 Database** | 2.2.220 | 인메모리 DB |
| **Lombok** | 1.18.28 | 코드 생성 |

### 🛠️ 개발 도구

| 도구 | 목적 |
|------|------|
| **ESLint + Prettier** | 코드 품질 및 포맷팅 |
| **Husky** | Git 훅 관리 |
| **Jest + Testing Library** | 단위 테스트 |
| **Cypress** | E2E 테스트 |
| **Swagger** | API 문서화 |

---

## 🎨 디자인 시스템

### 🎨 컬러 팔레트

```typescript
// Primary - Electric Blue
primary: {
  500: '#3b82f6',  // 메인 브랜드 컬러
  600: '#2563eb',  // 호버 상태
}

// Secondary - Cyber Purple  
secondary: {
  500: '#a855f7',  // 보조 브랜드 컬러
  600: '#9333ea',  // 액센트
}

// Accent - Neon Green
accent: {
  500: '#22c55e',  // 강조 컬러
  600: '#16a34a',  // 성공 상태
}
```

### 📱 반응형 브레이크포인트

```typescript
breakpoints: {
  xs: '475px',   // 📱 모바일
  sm: '640px',   // 📱 큰 모바일
  md: '768px',   // 📟 태블릿
  lg: '1024px',  // 💻 데스크톱
  xl: '1280px',  // 🖥️ 큰 데스크톱
  '2xl': '1536px' // 🖥️ 와이드 모니터
}
```

---

## 📈 성능 지표

### 🌟 Core Web Vitals 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| **FCP** (First Contentful Paint) | < 1.5s | 측정 중 |
| **LCP** (Largest Contentful Paint) | < 2.5s | 측정 중 |
| **FID** (First Input Delay) | < 100ms | 측정 중 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 측정 중 |

### 📊 성능 최적화 전략

- **코드 분할**: 라우트별 지연 로딩
- **이미지 최적화**: WebP 포맷 + 지연 로딩
- **캐싱 전략**: API 응답 및 정적 리소스 캐시
- **번들 최적화**: Tree shaking + 압축

---

## 🤝 기여 가이드

### 🔧 개발 환경 설정

1. **Fork** 후 로컬 클론
2. **브랜치 생성**: `git checkout -b feature/새기능`
3. **변경사항 커밋**: `git commit -m "feat: 새로운 기능 추가"`
4. **푸시**: `git push origin feature/새기능`
5. **Pull Request** 생성

### 📝 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서화
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정 변경
```

---

## 📞 연락처

### 👨‍💻 개발자 정보

- **이름**: [개발자명]
- **이메일**: [이메일 주소]
- **GitHub**: [@salieri009](https://github.com/salieri009)
- **LinkedIn**: [LinkedIn 프로필]

### 🐛 이슈 리포팅

버그나 개선사항은 [GitHub Issues](https://github.com/salieri009/MyTechPortfolio/issues)를 통해 제보해 주세요.

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리들의 도움을 받아 개발되었습니다:

- [React](https://reactjs.org/) - UI 라이브러리
- [Spring Boot](https://spring.io/projects/spring-boot) - 백엔드 프레임워크
- [Vite](https://vitejs.dev/) - 빌드 도구
- [TypeScript](https://www.typescriptlang.org/) - 타입 시스템

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

Made with ❤️ by **MyTechPortfolio Team**

</div>
- **Performance**: Code splitting, lazy loading, optimized builds

## Environment Configuration

### Development (Mock Mode)
```
VITE_USE_MOCK=true
VITE_AUTH_MODE=demo
```

### Production (Real API)
```
VITE_USE_MOCK=false
VITE_AUTH_MODE=jwt
```

## API Integration

When backend is ready:
1. Set `VITE_USE_MOCK=false` in `.env`
2. Services automatically switch from mock to real API calls
3. Auth services switch from demo mode to JWT token handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, styled-components, Zustand
- **Backend**: Spring Boot, MySQL, JPA (planned)
- **Deployment**: AWS S3/CloudFront + Elastic Beanstalk (planned)

## Documentation

- `/design-plan/specs/frontend-spec.md` - Frontend implementation details
- `/design-plan/specs/api-spec.md` - API endpoints and schemas
- `/design-plan/specs/db-spec.md` - Database schema and constraints
- `/design-plan/specs/ui-ux-spec.md` - UI/UX guidelines and components

## Next Steps

1. Implement Spring Boot backend following `/design-plan/specs/api-spec.md`
2. Set up MySQL database using `/design-plan/specs/db-spec.md`
3. Switch frontend to production mode
4. Deploy to AWS infrastructure

## Development Notes

- Mock data includes 3 sample projects with different tech stacks
- Filters and sorting work client-side in mock mode
- All API response envelopes match planned backend format
- Theme tokens and component library ready for customization
