# Creating Your First Component

이 튜토리얼은 프로젝트에서 첫 번째 컴포넌트를 만드는 방법을 단계별로 안내합니다.

## 목차

- [컴포넌트란?](#컴포넌트란)
- [Atomic Design Pattern](#atomic-design-pattern)
- [간단한 컴포넌트 만들기](#간단한-컴포넌트-만들기)
- [스타일링 추가하기](#스타일링-추가하기)
- [컴포넌트 사용하기](#컴포넌트-사용하기)
- [다음 단계](#다음-단계)

## 컴포넌트란?

컴포넌트는 재사용 가능한 UI 요소입니다. React에서 컴포넌트는 함수나 클래스로 작성되며, props를 받아 UI를 렌더링합니다.

## Atomic Design Pattern

이 프로젝트는 Atomic Design Pattern을 사용합니다. 컴포넌트는 크기에 따라 분류됩니다:

- **Atoms**: 가장 작은 단위의 컴포넌트 (Button, Input, Tag 등)
- **Molecules**: Atoms를 조합한 컴포넌트 (SearchBar, Card 등)
- **Organisms**: Molecules와 Atoms를 조합한 복잡한 컴포넌트 (Header, Footer 등)

자세한 내용은 [Atomic Design Pattern 설명](../explanation/atomic-design-pattern.md)을 참고하세요.

## 간단한 컴포넌트 만들기

`src/components/ui/` 디렉토리에 새로운 Atom 컴포넌트를 만들어보겠습니다.

### 1. 컴포넌트 파일 생성

`src/components/ui/Badge.tsx` 파일을 생성합니다:

```typescript
import React from 'react'
import styled from 'styled-components'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const BadgeBase = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${props => {
    const sizes = {
      sm: '2px 8px',
      md: '4px 12px',
      lg: '6px 16px'
    }
    return sizes[props.size || 'md']
  }};
  font-size: ${props => {
    const sizes = {
      sm: '12px',
      md: '14px',
      lg: '16px'
    }
    return sizes[props.size || 'md']
  }};
  font-weight: 600;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary[500]
      case 'secondary':
        return props.theme.colors.neutral[500]
      case 'success':
        return props.theme.colors.success
      case 'warning':
        return props.theme.colors.warning
      case 'error':
        return props.theme.colors.error
      default:
        return props.theme.colors.primary[500]
    }
  }};
  color: white;
`

export function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <BadgeBase variant={variant} size={size}>
      {children}
    </BadgeBase>
  )
}
```

### 2. 컴포넌트 내보내기

`src/components/ui/index.ts`에 컴포넌트를 추가합니다:

```typescript
export { Badge } from './Badge'
export type { BadgeProps } from './Badge'
```

## 스타일링 추가하기

컴포넌트는 Styled Components를 사용하여 스타일링됩니다. 테마 시스템을 활용하여 일관된 디자인을 유지하세요.

### 테마 사용하기

테마의 색상, 간격, 타이포그래피를 사용합니다:

```typescript
const StyledComponent = styled.div`
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`
```

자세한 내용은 [Styling System 설명](../explanation/styling-system.md)을 참고하세요.

## 컴포넌트 사용하기

만든 컴포넌트를 페이지나 다른 컴포넌트에서 사용할 수 있습니다:

```typescript
import { Badge } from '@components/ui'

function MyPage() {
  return (
    <div>
      <Badge variant="primary">New</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="error" size="sm">Error</Badge>
    </div>
  )
}
```

## 다음 단계

컴포넌트를 만들었으니 다음을 학습하세요:

1. [Understanding Styling System](./understanding-styling-system.md) - 스타일링 시스템을 더 깊이 이해하기
2. [Add New Component](../how-to/add-new-component.md) - 더 복잡한 컴포넌트 만들기
3. [Components API Reference](../reference/components-api.md) - 기존 컴포넌트 API 확인하기

## 모범 사례

- **타입 안정성**: TypeScript를 사용하여 props 타입을 명확히 정의하세요
- **재사용성**: 컴포넌트는 가능한 한 재사용 가능하게 만드세요
- **일관성**: 기존 컴포넌트의 패턴을 따르세요
- **접근성**: 접근성 가이드라인을 준수하세요 (ARIA 속성, 키보드 네비게이션 등)









