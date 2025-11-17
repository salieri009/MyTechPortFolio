# State Management with Zustand

## 개요

본 프로젝트는 Zustand를 사용하여 전역 상태를 관리합니다. Zustand는 Redux보다 간단하고 가벼우며, TypeScript와 잘 통합되는 상태 관리 라이브러리입니다.

## Zustand 선택 이유

### 1. 간단함
- Boilerplate 코드 최소화
- 직관적인 API

### 2. 가벼움
- 작은 번들 크기
- 빠른 런타임 성능

### 3. TypeScript 지원
- 완벽한 타입 추론
- 타입 안정성

### 4. 유연성
- 미들웨어 지원 (persist, devtools 등)
- 다양한 패턴 지원

## Store 구조

### 위치
`src/stores/`

### 주요 Store

#### 1. themeStore
**파일**: `src/stores/themeStore.ts`

테마(다크/라이트 모드) 상태를 관리합니다.

```typescript
interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark }))
    }),
    {
      name: 'theme-storage' // localStorage 키
    }
  )
)
```

**특징**:
- `persist` 미들웨어로 사용자 설정 영구 저장
- localStorage에 자동 저장/복원

**사용 예시**:
```typescript
function MyComponent() {
  const { isDark, toggleTheme } = useThemeStore()
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

#### 2. authStore
**파일**: `src/stores/authStore.ts`

인증 상태를 관리합니다.

```typescript
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}
```

**특징**:
- 인증 상태와 사용자 정보 관리
- 로그인/로그아웃 액션 제공

## 상태 관리 전략

### 1. 전역 상태 최소화

**원칙**: 가능한 한 로컬 상태를 사용하고, 전역 상태는 꼭 필요한 경우만 사용

**전역 상태 사용 사례**:
- 테마 설정 (전역적으로 적용)
- 인증 상태 (여러 컴포넌트에서 공유)
- 사용자 정보 (여러 페이지에서 사용)

**로컬 상태 사용 사례**:
- 폼 입력 값
- 모달 열림/닫힘 상태
- 컴포넌트 내부 UI 상태

### 2. Store 분리

각 도메인별로 Store를 분리하여 관리:

```
stores/
├── themeStore.ts      # 테마 관련
├── authStore.ts       # 인증 관련
└── filters.ts         # 필터 관련 (필요시)
```

**장점**:
- 관심사 분리
- 코드 가독성 향상
- 유지보수 용이

### 3. Selector 패턴

필요한 상태만 선택적으로 구독:

```typescript
// ❌ 나쁜 예: 전체 store 구독
const store = useThemeStore()

// ✅ 좋은 예: 필요한 상태만 구독
const isDark = useThemeStore(state => state.isDark)
const toggleTheme = useThemeStore(state => state.toggleTheme)
```

**장점**:
- 불필요한 리렌더링 방지
- 성능 최적화

## Persist 미들웨어

### 사용 목적
사용자 설정을 브라우저에 영구 저장하여 다음 방문 시에도 유지

### 설정 예시

```typescript
import { persist } from 'zustand/middleware'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // ... store 정의
    }),
    {
      name: 'theme-storage',        // localStorage 키
      // storage: localStorage,      // 기본값
      // partialize: (state) => ({  // 저장할 상태 선택
      //   isDark: state.isDark
      // })
    }
  )
)
```

### 지원하는 Storage
- `localStorage` (기본값)
- `sessionStorage`
- 커스텀 스토리지

## 비동기 액션

### 패턴 1: 직접 처리

```typescript
interface MyStore {
  data: Data | null
  loading: boolean
  fetchData: () => Promise<void>
}

export const useMyStore = create<MyStore>((set) => ({
  data: null,
  loading: false,
  fetchData: async () => {
    set({ loading: true })
    try {
      const data = await api.getData()
      set({ data, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  }
}))
```

### 패턴 2: 서비스 레이어 분리

```typescript
// Store는 액션만 정의
export const useMyStore = create<MyStore>((set) => ({
  data: null,
  setData: (data: Data) => set({ data })
}))

// 컴포넌트에서 서비스 호출
function MyComponent() {
  const setData = useMyStore(state => state.setData)
  
  useEffect(() => {
    dataService.getData().then(setData)
  }, [])
}
```

## DevTools 연동

개발 환경에서 Redux DevTools와 연동 가능:

```typescript
import { devtools } from 'zustand/middleware'

export const useMyStore = create<MyStore>()(
  devtools(
    (set) => ({
      // ... store 정의
    }),
    { name: 'MyStore' }
  )
)
```

## 모범 사례

### 1. Store는 얕게 유지
- 깊은 중첩 구조 지양
- 평면적인 상태 구조 선호

### 2. 불변성 유지
- 상태 업데이트 시 새 객체 생성
- immer 미들웨어 활용 가능

### 3. 타입 안정성
- TypeScript로 Store 타입 명시
- 타입 추론 활용

### 4. 테스트 가능성
- 순수 함수로 액션 정의
- Mock Store 생성 용이

## Redux와의 비교

| 특징 | Zustand | Redux |
|------|---------|-------|
| Boilerplate | 적음 | 많음 |
| 학습 곡선 | 낮음 | 높음 |
| 번들 크기 | 작음 | 큼 |
| TypeScript | 우수 | 양호 |
| DevTools | 지원 | 기본 제공 |
| 미들웨어 | 선택적 | 필수적 |

## 마이그레이션 고려사항

### Redux에서 Zustand로
- 대부분의 경우 직접 대응 가능
- Redux Toolkit과 유사한 패턴

### Context API에서 Zustand로
- Provider 불필요
- 성능 향상 (불필요한 리렌더링 감소)

## 참고 자료

- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Zustand GitHub](https://github.com/pmndrs/zustand)


