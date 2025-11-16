# Add New Component

이 가이드는 프로젝트에 새 컴포넌트를 추가하는 방법을 설명합니다.

## 목차

- [컴포넌트 위치 결정](#컴포넌트-위치-결정)
- [컴포넌트 생성](#컴포넌트-생성)
- [스타일링](#스타일링)
- [컴포넌트 내보내기](#컴포넌트-내보내기)
- [사용하기](#사용하기)

## 컴포넌트 위치 결정

Atomic Design Pattern에 따라 컴포넌트의 복잡도에 따라 위치를 결정합니다:

- **Atoms**: `src/components/ui/` - 가장 작은 단위 (Button, Input, Tag 등)
- **Molecules**: `src/components/molecules/` - Atoms 조합 (SearchBar, Card 등)
- **Organisms**: `src/components/organisms/` - 복잡한 컴포넌트 (Header, Footer 등)
- **Domain-specific**: `src/components/project/`, `src/components/sections/` 등

## 컴포넌트 생성

### 1. 컴포넌트 파일 생성

예를 들어, `src/components/ui/Alert.tsx`를 생성합니다:

```typescript
import React from 'react'
import styled from 'styled-components'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  onClose?: () => void
}

const AlertBase = styled.div<AlertProps>`
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return props.theme.colors.success
      case 'warning':
        return props.theme.colors.warning
      case 'error':
        return props.theme.colors.error
      default:
        return props.theme.colors.info
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing[2]};
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`

export function Alert({ children, variant = 'info', onClose }: AlertProps) {
  return (
    <AlertBase variant={variant}>
      <span>{children}</span>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close">
          ×
        </CloseButton>
      )}
    </AlertBase>
  )
}
```

### 2. 타입 정의

컴포넌트의 props 타입을 명확히 정의합니다:

```typescript
export interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  onClose?: () => void
}
```

## 스타일링

### 테마 사용

테마 시스템을 활용하여 일관된 스타일을 적용합니다:

```typescript
const StyledComponent = styled.div`
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.radius.md};
  box-shadow: ${props => props.theme.shadows.sm};
`
```

### 반응형 디자인

미디어 쿼리를 사용하여 반응형 디자인을 구현합니다:

```typescript
const ResponsiveComponent = styled.div`
  padding: ${props => props.theme.spacing[4]};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[2]};
  }
`
```

## 컴포넌트 내보내기

### 1. index.ts 파일에 추가

해당 디렉토리의 `index.ts` 파일에 컴포넌트를 추가합니다:

```typescript
// src/components/ui/index.ts
export { Alert } from './Alert'
export type { AlertProps } from './Alert'
```

### 2. 공통 index.ts에 추가 (선택사항)

`src/components/common/index.ts`에 추가하여 더 쉽게 import할 수 있습니다:

```typescript
// src/components/common/index.ts
export { Alert } from '../ui/Alert'
export type { AlertProps } from '../ui/Alert'
```

## 사용하기

컴포넌트를 다른 곳에서 사용합니다:

```typescript
import { Alert } from '@components/ui'

function MyPage() {
  return (
    <div>
      <Alert variant="success">작업이 완료되었습니다!</Alert>
      <Alert variant="error" onClose={() => console.log('closed')}>
        오류가 발생했습니다.
      </Alert>
    </div>
  )
}
```

## 모범 사례

### 1. 타입 안정성

- 모든 props에 타입을 정의하세요
- Optional props는 `?`를 사용하세요
- 기본값을 제공하세요

### 2. 접근성

- 시맨틱 HTML을 사용하세요
- ARIA 속성을 적절히 사용하세요
- 키보드 네비게이션을 지원하세요

### 3. 재사용성

- 컴포넌트는 가능한 한 재사용 가능하게 만드세요
- props를 통해 커스터마이징할 수 있도록 하세요
- 기본 동작을 제공하세요

### 4. 성능

- 불필요한 리렌더링을 피하기 위해 React.memo를 사용하세요
- 큰 리스트의 경우 가상화를 고려하세요

### 5. 스타일링

- 테마 시스템을 사용하세요
- 하드코딩된 값 대신 테마 토큰을 사용하세요
- 반응형 디자인을 고려하세요

## 관련 문서

- [Creating Your First Component](../tutorials/creating-your-first-component.md) - 컴포넌트 만들기 튜토리얼
- [Understanding Styling System](../tutorials/understanding-styling-system.md) - 스타일링 시스템 튜토리얼
- [Atomic Design Pattern](../explanation/atomic-design-pattern.md) - Atomic Design 설명
- [Components API Reference](../reference/components-api.md) - 컴포넌트 API 참조

