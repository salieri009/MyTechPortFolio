# Understanding Styling System

이 튜토리얼은 프로젝트의 스타일링 시스템을 이해하는 방법을 설명합니다.

## 목차

- [스타일링 시스템 개요](#스타일링-시스템-개요)
- [Styled Components](#styled-components)
- [테마 시스템](#테마-시스템)
- [디자인 토큰](#디자인-토큰)
- [반응형 디자인](#반응형-디자인)
- [다음 단계](#다음-단계)

## 스타일링 시스템 개요

이 프로젝트는 **Styled Components**를 사용하여 CSS-in-JS 방식으로 스타일링합니다. 이는 다음과 같은 장점이 있습니다:

- **컴포넌트 기반**: 스타일이 컴포넌트와 함께 관리됩니다
- **타입 안정성**: TypeScript와 통합되어 타입 체크가 가능합니다
- **동적 스타일링**: props를 기반으로 동적으로 스타일을 변경할 수 있습니다
- **테마 지원**: 전역 테마 시스템을 통해 일관된 디자인을 유지합니다

## Styled Components

Styled Components는 템플릿 리터럴을 사용하여 스타일을 정의합니다:

```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primary[600]};
  }
`
```

### Props 기반 스타일링

컴포넌트의 props를 기반으로 스타일을 동적으로 변경할 수 있습니다:

```typescript
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${props => 
    props.$variant === 'primary' 
      ? props.theme.colors.primary[500]
      : props.theme.colors.neutral[500]
  };
`
```

> **참고**: Styled Components에서 props는 `$` 접두사를 사용하여 DOM에 전달되지 않도록 합니다.

## 테마 시스템

테마는 `src/styles/theme.ts`에 정의되어 있으며, 모든 컴포넌트에서 접근할 수 있습니다.

### 테마 구조

```typescript
const theme = {
  colors: {
    primary: { /* 색상 팔레트 */ },
    neutral: { /* 중립 색상 */ },
    // ...
  },
  typography: {
    fontFamily: { /* 폰트 패밀리 */ },
    fontSize: { /* 폰트 크기 */ },
    // ...
  },
  spacing: { /* 간격 시스템 */ },
  radius: { /* 둥근 모서리 */ },
  shadows: { /* 그림자 */ },
  // ...
}
```

### 테마 사용하기

컴포넌트에서 테마를 사용하려면 `props.theme`을 통해 접근합니다:

```typescript
const Card = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`
```

## 디자인 토큰

프로젝트는 KickoffLabs 가이드라인을 준수하여 디자인 토큰을 제한합니다:

### 색상 팔레트

- **Primary**: Electric Blue 계열 (CTA 및 강조)
- **Neutral**: Modern Gray 계열 (텍스트, 배경, 경계선)

> **중요**: Secondary와 Accent 색상은 제거되었으며, Primary로 매핑되어 하위 호환성을 유지합니다.

### 폰트 패밀리

- **Primary**: Inter (모든 텍스트에 사용)

> **중요**: Mono와 Display 폰트는 제거되었으며, Primary로 매핑되어 하위 호환성을 유지합니다.

### 간격 시스템

간격은 `spacing` 객체를 통해 일관되게 관리됩니다:

```typescript
spacing: {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  // ...
}
```

## 반응형 디자인

미디어 쿼리를 사용하여 반응형 디자인을 구현합니다:

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

### 브레이크포인트

프로젝트에서 사용하는 주요 브레이크포인트:

- **모바일**: 480px 이하
- **태블릿**: 768px 이하
- **데스크톱**: 1024px 이상

## 다음 단계

스타일링 시스템을 이해했으니 다음을 학습하세요:

1. [Styling System 설명](../explanation/styling-system.md) - 더 자세한 아키텍처 설명
2. [Customize Theme](../how-to/customize-theme.md) - 테마 커스터마이징하기
3. [Theme Reference](../reference/theme-reference.md) - 테마 API 참조

## 모범 사례

- **테마 사용**: 하드코딩된 색상이나 간격 대신 테마를 사용하세요
- **일관성**: 기존 컴포넌트의 스타일링 패턴을 따르세요
- **반응형**: 모바일부터 데스크톱까지 모든 화면 크기를 고려하세요
- **성능**: 불필요한 스타일 재계산을 피하세요

