# Customize Theme

이 가이드는 프로젝트의 테마를 커스터마이징하는 방법을 설명합니다.

## 목차

- [테마 파일 위치](#테마-파일-위치)
- [색상 커스터마이징](#색상-커스터마이징)
- [타이포그래피 커스터마이징](#타이포그래피-커스터마이징)
- [간격 시스템 커스터마이징](#간격-시스템-커스터마이징)
- [다크 모드 커스터마이징](#다크-모드-커스터마이징)
- [모범 사례](#모범-사례)

## 테마 파일 위치

테마는 `src/styles/theme.ts`에 정의되어 있습니다. 이 파일에는 `lightTheme`과 `darkTheme`이 정의되어 있습니다.

## 색상 커스터마이징

### Primary 색상 변경

Primary 색상은 CTA 버튼과 강조 요소에 사용됩니다:

```typescript
// src/styles/theme.ts
const baseTheme = {
  colors: {
    primary: {
      50: '#eff6ff',   // 가장 밝은 색
      100: '#dbeafe',
      // ...
      500: '#3b82f6',  // 메인 브랜드 컬러
      // ...
      950: '#172554'   // 가장 어두운 색
    }
  }
}
```

### 색상 팔레트 생성

새로운 색상 팔레트를 만들려면 [Coolors](https://coolors.co/)나 [Adobe Color](https://color.adobe.com/) 같은 도구를 사용하세요.

### KickoffLabs 원칙 준수

프로젝트는 KickoffLabs 가이드라인을 준수합니다:

- **색상 제한**: Primary와 Neutral만 사용
- **역할 할당**: Primary는 CTA에만 사용
- **일관성**: 모든 곳에서 동일한 색상 사용

## 타이포그래피 커스터마이징

### 폰트 패밀리 변경

현재 프로젝트는 Inter 폰트만 사용합니다:

```typescript
typography: {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
}
```

### 폰트 크기 조정

```typescript
typography: {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    // ...
  }
}
```

### KickoffLabs 원칙 준수

- **폰트 제한**: 하나의 폰트 패밀리만 사용 (Inter)
- **스타일 변형**: 같은 폰트의 bold, italic 등을 사용하여 변화를 줍니다

## 간격 시스템 커스터마이징

간격 시스템은 일관된 레이아웃을 위해 사용됩니다:

```typescript
spacing: {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  // ...
}
```

### 사용 예시

```typescript
const Card = styled.div`
  padding: ${props => props.theme.spacing[4]};  // 16px
  margin-bottom: ${props => props.theme.spacing[6]};  // 24px
`
```

## 다크 모드 커스터마이징

다크 모드는 `darkTheme` 객체에서 정의됩니다:

```typescript
export const darkTheme: Theme = {
  ...baseTheme,
  mode: 'dark',
  colors: {
    ...baseTheme.colors,
    background: baseTheme.colors.neutral[900],
    surface: baseTheme.colors.neutral[800],
    text: baseTheme.colors.neutral[0],
    textSecondary: baseTheme.colors.neutral[400],
    border: baseTheme.colors.neutral[700],
  }
}
```

### 다크 모드 색상 조정

다크 모드에서 특정 색상을 조정하려면:

```typescript
export const darkTheme: Theme = {
  // ...
  colors: {
    // ...
    primary: {
      // 다크 모드에 맞게 조정
      500: '#60a5fa',  // 더 밝은 색상
    }
  }
}
```

## 모범 사례

### 1. 일관성 유지

- 테마 토큰을 사용하여 일관된 디자인을 유지하세요
- 하드코딩된 색상이나 간격을 피하세요

### 2. 접근성 고려

- 색상 대비 비율을 WCAG AA 기준(4.5:1) 이상으로 유지하세요
- 색상만으로 정보를 전달하지 마세요

### 3. 성능 최적화

- 테마 변경 시 불필요한 리렌더링을 피하세요
- 테마 객체는 불변(immutable)으로 유지하세요

### 4. 테스트

- 라이트 모드와 다크 모드 모두에서 테스트하세요
- 다양한 화면 크기에서 테스트하세요

## 관련 문서

- [Understanding Styling System](../tutorials/understanding-styling-system.md) - 스타일링 시스템 튜토리얼
- [Styling System 설명](../explanation/styling-system.md) - 스타일링 시스템 상세 설명
- [Theme Reference](../reference/theme-reference.md) - 테마 API 참조


