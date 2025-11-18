# Styling System

## 개요

본 프로젝트는 Styled Components를 사용한 CSS-in-JS 방식으로 스타일링합니다. 테마 기반 디자인 시스템을 구축하여 일관된 디자인을 유지하고, 다크 모드를 지원합니다.

## 기술 스택

- **Styled Components**: CSS-in-JS 라이브러리
- **Theme Provider**: 전역 테마 관리
- **TypeScript**: 타입 안정성

## 테마 시스템

### 위치
`src/styles/theme.ts`

### 테마 구조

```typescript
const baseTheme = {
  colors: {
    primary: { /* ... */ },
    neutral: { /* ... */ },
    // ...
  },
  typography: {
    fontFamily: { /* ... */ },
    fontSize: { /* ... */ },
    // ...
  },
  spacing: { /* ... */ },
  radius: { /* ... */ },
  shadows: { /* ... */ },
  // ...
}

export const lightTheme = { ...baseTheme, mode: 'light' }
export const darkTheme = { ...baseTheme, mode: 'dark' }
```

### 디자인 토큰

#### 1. Colors (색상)

**KickoffLabs 가이드라인 준수**: 1-3개 색상만 사용

- **Primary**: CTA 버튼 및 강조 요소
- **Neutral**: 텍스트, 배경, 경계선
- **Semantic**: Success, Warning, Error, Info

```typescript
colors: {
  primary: {
    50: '#eff6ff',   // 가장 밝은 색
    500: '#3b82f6',  // 메인 브랜드 컬러
    950: '#172554'   // 가장 어두운 색
  },
  neutral: {
    0: '#ffffff',
    500: '#737373',
    950: '#0a0a0a'
  }
}
```

#### 2. Typography (타이포그래피)

**KickoffLabs 가이드라인 준수**: 1개 폰트 패밀리만 사용

- **Font Family**: Inter (Primary)
- **Font Size**: xs ~ 9xl
- **Font Weight**: thin ~ black
- **Line Height**: none ~ loose
- **Letter Spacing**: tighter ~ widest

#### 3. Spacing (간격)

8px 기준의 간격 시스템:

```typescript
spacing: {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  4: '1rem',     // 16px
  8: '2rem',     // 32px
  // ...
}
```

#### 4. Border Radius

```typescript
radius: {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '1rem',      // 16px
  full: '9999px'   // 완전한 원
}
```

#### 5. Shadows

```typescript
shadows: {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  // ...
}
```

## Styled Components 사용법

### 기본 사용

```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.radius.md};
`
```

### Props 기반 스타일링

```typescript
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${props => 
    props.$variant === 'primary' 
      ? props.theme.colors.primary[500]
      : props.theme.colors.neutral[200]
  };
`
```

**주의**: Styled Components에서 props는 `$` 접두사를 사용하여 DOM에 전달되지 않도록 해야 합니다.

### 테마 접근

```typescript
const Component = styled.div`
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  
  ${props => props.theme.mode === 'dark' && `
    border-color: ${props.theme.colors.neutral[700]};
  `}
`
```

### 중첩 스타일링

```typescript
const Card = styled.div`
  padding: ${props => props.theme.spacing[4]};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  & > * {
    margin-bottom: ${props => props.theme.spacing[2]};
  }
`
```

## 반응형 디자인

### Media Queries

```typescript
const Container = styled.div`
  padding: ${props => props.theme.spacing[4]};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[2]};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing[1]};
  }
`
```

### Breakpoints

테마에서 정의된 breakpoint 사용:

```typescript
const Container = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    // ...
  }
`
```

## 다크 모드

### 테마 전환

```typescript
// App.tsx
const { isDark } = useThemeStore()
const currentTheme = isDark ? darkTheme : lightTheme

<ThemeProvider theme={currentTheme}>
  {/* ... */}
</ThemeProvider>
```

### 조건부 스타일링

```typescript
const Component = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800]};
  `}
`
```

## 전역 스타일

### 위치
`src/styles/GlobalStyle.ts`

### 내용

- CSS Reset
- 기본 폰트 설정
- 전역 스타일

```typescript
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`
```

## 타입 안정성

### styled.d.ts

```typescript
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: { /* ... */ }
    typography: { /* ... */ }
    // ...
  }
}
```

이렇게 하면 TypeScript가 테마 타입을 자동으로 추론합니다.

## 모범 사례

### 1. 테마 토큰 사용
- 하드코딩된 값 지양
- 테마에서 정의된 토큰 사용

```typescript
// ❌ 나쁜 예
const Button = styled.button`
  padding: 12px 24px;
  color: #3b82f6;
`

// ✅ 좋은 예
const Button = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.primary[500]};
`
```

### 2. 재사용 가능한 스타일 컴포넌트
- 공통 스타일은 별도 컴포넌트로 분리
- props로 변형 가능하도록 설계

### 3. 성능 최적화
- 불필요한 리렌더링 방지
- `shouldForwardProp` 사용으로 DOM props 필터링

### 4. 접근성
- 포커스 스타일 명시
- 색상 대비 비율 준수 (WCAG AA)

## KickoffLabs 가이드라인 준수

### 색상 제한
- Primary + Neutral만 사용 (1-3개 색상)
- CTA는 Primary 색상만 사용

### 폰트 제한
- Inter 폰트 패밀리만 사용 (1개 폰트)
- 폰트 스타일(bold, italic 등)로 변형

### 일관성
- 모든 버튼 동일한 스타일
- 패딩, border-radius 등 일관된 값 사용

## 참고 자료

- [Styled Components 공식 문서](https://styled-components.com/)
- [KickoffLabs 가이드라인](https://kickofflabs.com/blog/landing-page-fonts-colors/)




