# Getting Started

이 튜토리얼은 MyPortFolio Frontend 프로젝트를 시작하는 방법을 단계별로 안내합니다.

## 목차

- [필수 요구사항](#필수-요구사항)
- [프로젝트 설치](#프로젝트-설치)
- [개발 서버 실행](#개발-서버-실행)
- [프로젝트 구조 이해하기](#프로젝트-구조-이해하기)
- [다음 단계](#다음-단계)

## 필수 요구사항

프로젝트를 시작하기 전에 다음이 설치되어 있어야 합니다:

- **Node.js**: v18.0.0 이상
- **npm**: v9.0.0 이상 (또는 yarn, pnpm)
- **Git**: 최신 버전

### 설치 확인

터미널에서 다음 명령어로 설치 여부를 확인하세요:

```bash
node --version
npm --version
git --version
```

## 프로젝트 설치

1. **저장소 클론** (이미 클론했다면 이 단계를 건너뛰세요)

```bash
git clone <repository-url>
cd MyPortFolio/frontend
```

2. **의존성 설치**

```bash
npm install
```

이 명령어는 `package.json`에 정의된 모든 의존성을 설치합니다.

주요 의존성:
- React 18.2.0
- TypeScript 5.5.3
- Vite 5.3.3
- Styled Components 6.1.11
- React Router DOM 6.23.1
- i18next 25.3.4
- Zustand 4.5.7

## 개발 서버 실행

설치가 완료되면 개발 서버를 시작할 수 있습니다:

```bash
npm run dev
```

서버가 시작되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 개발 서버 기능

- **Hot Module Replacement (HMR)**: 코드 변경 시 자동으로 페이지가 새로고침됩니다
- **Fast Refresh**: React 컴포넌트의 상태를 유지하면서 업데이트됩니다
- **API Proxy**: `/api` 요청이 자동으로 `http://localhost:8080/api/v1`로 프록시됩니다

## 프로젝트 구조 이해하기

프로젝트는 다음과 같은 구조로 구성되어 있습니다:

```
frontend/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── services/      # API 및 비즈니스 로직
│   ├── stores/        # 상태 관리 (Zustand)
│   ├── styles/        # 테마 및 전역 스타일
│   ├── hooks/         # 커스텀 훅
│   ├── utils/         # 유틸리티 함수
│   ├── types/         # TypeScript 타입 정의
│   └── i18n/          # 다국어 설정
├── public/            # 정적 파일
├── docs/              # 문서
└── package.json       # 프로젝트 설정
```

### 주요 디렉토리 설명

- **components/**: Atomic Design Pattern에 따라 atoms, molecules, organisms로 구성
- **pages/**: React Router로 연결되는 페이지 컴포넌트
- **services/**: 백엔드 API와 통신하는 서비스 레이어
- **stores/**: Zustand를 사용한 전역 상태 관리
- **styles/**: Styled Components 테마 및 전역 스타일

## 다음 단계

프로젝트를 시작했으니 다음 튜토리얼을 진행하세요:

1. [Creating Your First Component](./creating-your-first-component.md) - 첫 컴포넌트 만들기
2. [Understanding Styling System](./understanding-styling-system.md) - 스타일링 시스템 이해하기
3. [Setting Up Routing](./setting-up-routing.md) - 라우팅 설정하기

또는 [How-to Guides](../how-to/)에서 특정 작업을 수행하는 방법을 찾아보세요.

## 문제 해결

### 포트가 이미 사용 중인 경우

다른 포트를 사용하려면 `vite.config.ts`에서 포트를 변경하거나 환경 변수를 설정하세요:

```bash
PORT=3000 npm run dev
```

### 의존성 설치 오류

`node_modules`를 삭제하고 다시 설치하세요:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 타입 오류

TypeScript 타입을 확인하세요:

```bash
npm run build
```




