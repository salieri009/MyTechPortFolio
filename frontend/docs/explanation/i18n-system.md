# Internationalization (i18n) Implementation Details

## 개요

본 프로젝트는 React i18next를 사용하여 다국어 지원을 구현합니다. 한국어(ko), 영어(en), 일본어(ja)를 지원하며, 브라우저 설정을 기반으로 자동으로 언어를 감지합니다.

## 기술 스택

- **i18next**: i18n 엔진
- **react-i18next**: React 통합
- **i18next-browser-languagedetector**: 브라우저 언어 감지

## 설정

### 위치
`src/i18n/config.ts`

### 기본 설정

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja }
    },
    fallbackLng: 'ko',
    supportedLngs: ['ko', 'en', 'ja'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  })
```

## 번역 파일 구조

### 위치
`src/i18n/locales/`

### 파일 구조

```
locales/
├── ko.json    # 한국어
├── en.json    # 영어
└── ja.json    # 일본어
```

### JSON 구조 예시

```json
{
  "navigation": {
    "home": "홈",
    "projects": "프로젝트",
    "about": "소개"
  },
  "hero": {
    "greeting": "안녕하세요",
    "name": "홍길동",
    "headline": "풀스택 개발자"
  }
}
```

## 사용법

### useTranslation Hook

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.greeting', { name: '홍길동' })}</p>
    </div>
  )
}
```

### 기본 번역

```typescript
t('navigation.home')  // "홈"
```

### 기본값 제공

```typescript
t('navigation.home', 'Home')  // 키가 없으면 "Home" 반환
```

### 변수 삽입

```typescript
// 번역 파일
{
  "greeting": "안녕하세요, {{name}}님"
}

// 사용
t('greeting', { name: '홍길동' })  // "안녕하세요, 홍길동님"
```

### 복수형 처리

```typescript
// 번역 파일
{
  "items": "{{count}}개 항목",
  "items_plural": "{{count}}개 항목들"
}

// 사용
t('items', { count: 1 })   // "1개 항목"
t('items', { count: 5 })   // "5개 항목들"
```

## 언어 전환

### LanguageSwitcher 컴포넌트

```typescript
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  
  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  )
}
```

### 언어 감지 순서

1. **localStorage**: 이전에 선택한 언어
2. **navigator**: 브라우저 언어 설정
3. **htmlTag**: HTML lang 속성

## 네임스페이스 (Namespaces)

### 사용 목적
번역 파일을 논리적으로 분리하여 관리

### 설정

```typescript
i18n.init({
  defaultNS: 'translation',
  ns: ['translation', 'common', 'errors']
})
```

### 사용

```typescript
t('key', { ns: 'common' })
```

## 동적 로딩

### 필요 시에만 번역 파일 로드

```typescript
import(`./locales/${language}.json`).then(resources => {
  i18n.addResourceBundle(language, 'translation', resources)
})
```

## 타입 안정성

### 번역 키 타입 정의

```typescript
// types/i18n.d.ts
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof ko
    }
  }
}
```

이렇게 하면 TypeScript가 번역 키를 자동 완성하고 타입 체크를 수행합니다.

## 모범 사례

### 1. 키 네이밍
- 계층적 구조 사용 (`section.subsection.key`)
- 의미 있는 키명 사용

```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Full Stack Developer"
  }
}
```

### 2. 키 중복 방지
- 공통 텍스트는 별도 네임스페이스로 분리
- 재사용 가능한 키 정의

### 3. 컨텍스트 고려
- 같은 단어라도 컨텍스트에 따라 다른 번역
- 키에 컨텍스트 포함

```json
{
  "button": {
    "submit": "제출",
    "cancel": "취소"
  },
  "form": {
    "submit": "제출하기",
    "cancel": "취소하기"
  }
}
```

### 4. HTML 이스케이핑
- 기본적으로 HTML 이스케이핑됨
- HTML이 필요한 경우 `dangerouslySetInnerHTML` 사용 (주의)

## 디버깅

### 개발 모드

```typescript
i18n.init({
  debug: process.env.NODE_ENV === 'development'
})
```

디버그 모드에서는:
- 누락된 키 경고
- 언어 감지 과정 로그
- 번역 과정 상세 정보

## 성능 최적화

### 1. 번역 파일 크기 최적화
- 사용하지 않는 번역 제거
- 중복 제거

### 2. 지연 로딩
- 필요한 언어만 로드
- 동적 import 활용

### 3. 메모이제이션
- 번역 결과 캐싱
- 불필요한 재계산 방지

## 현재 지원 언어

| 언어 | 코드 | 파일 |
|------|------|------|
| 한국어 | ko | `ko.json` |
| 영어 | en | `en.json` |
| 일본어 | ja | `ja.json` |

## 언어 추가 방법

### 1. 번역 파일 생성

`src/i18n/locales/[language].json` 파일 생성

### 2. 설정 업데이트

```typescript
import [language] from './locales/[language].json'

i18n.init({
  resources: {
    // ...
    [language]: { translation: [language] }
  },
  supportedLngs: ['ko', 'en', 'ja', '[language]']
})
```

### 3. LanguageSwitcher 업데이트

새 언어 옵션 추가

## 참고 자료

- [React i18next 공식 문서](https://react.i18next.com/)
- [i18next 공식 문서](https://www.i18next.com/)

