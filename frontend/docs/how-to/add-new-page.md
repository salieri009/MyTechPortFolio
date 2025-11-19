# Add New Page

이 가이드는 프로젝트에 새 페이지를 추가하는 방법을 설명합니다.

## 목차

- [페이지 생성](#페이지-생성)
- [라우트 추가](#라우트-추가)
- [다국어 지원 추가](#다국어-지원-추가)
- [테스트](#테스트)

## 페이지 생성

### 1. 페이지 컴포넌트 생성

`src/pages/` 디렉토리에 새 페이지 컴포넌트를 만듭니다:

```typescript
// src/pages/ContactPage.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'
import styled from 'styled-components'

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 32px;
  text-align: center;
`

const PageContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[6]};
`

export function ContactPage() {
  const { t } = useTranslation()
  
  return (
    <Container>
      <PageContent>
        <PageTitle>{t('contact.title')}</PageTitle>
        {/* 페이지 내용 */}
      </PageContent>
    </Container>
  )
}
```

### 2. 페이지 내보내기

페이지를 내보내는 방법은 두 가지가 있습니다:

**방법 1: 기본 내보내기**
```typescript
export default ContactPage
```

**방법 2: named export (권장)**
```typescript
export function ContactPage() {
  // ...
}
```

## 라우트 추가

`src/App.tsx`에 새 라우트를 추가합니다:

```typescript
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// 코드 스플리팅을 위한 lazy loading
const ContactPage = lazy(() => 
  import('@pages/ContactPage').then(module => ({ 
    default: module.ContactPage 
  }))
)

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* 다른 라우트들 */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </Suspense>
  )
}
```

## 다국어 지원 추가

### 1. 번역 키 추가

`src/i18n/locales/` 디렉토리의 각 언어 파일에 번역을 추가합니다:

**ko.json:**
```json
{
  "contact": {
    "title": "연락하기",
    "subtitle": "언제든지 연락주세요"
  }
}
```

**en.json:**
```json
{
  "contact": {
    "title": "Contact",
    "subtitle": "Feel free to reach out anytime"
  }
}
```

**ja.json:**
```json
{
  "contact": {
    "title": "お問い合わせ",
    "subtitle": "いつでもお気軽にご連絡ください"
  }
}
```

### 2. 페이지에서 사용

```typescript
import { useTranslation } from 'react-i18next'

export function ContactPage() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.subtitle')}</p>
    </div>
  )
}
```

## 테스트

### 1. 개발 서버에서 확인

```bash
npm run dev
```

브라우저에서 `http://localhost:5173/contact`로 접속하여 페이지가 정상적으로 표시되는지 확인합니다.

### 2. 빌드 테스트

```bash
npm run build
```

빌드가 성공적으로 완료되는지 확인합니다.

## 모범 사례

- **코드 스플리팅**: 모든 페이지에 lazy loading을 적용하세요
- **컨테이너 사용**: `Container` 컴포넌트로 페이지를 감싸 일관된 레이아웃을 유지하세요
- **다국어 지원**: 모든 텍스트를 i18n을 통해 관리하세요
- **타입 안정성**: TypeScript를 사용하여 타입을 명확히 정의하세요
- **접근성**: 시맨틱 HTML과 ARIA 속성을 사용하세요

## 관련 문서

- [Setting Up Routing](../tutorials/setting-up-routing.md) - 라우팅 튜토리얼
- [Add i18n Support](./add-i18n-support.md) - 다국어 지원 가이드
- [Routing Structure](../explanation/routing-structure.md) - 라우팅 구조 설명









