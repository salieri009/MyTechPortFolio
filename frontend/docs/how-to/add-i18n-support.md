# Add i18n Support

이 가이드는 새 기능에 다국어 지원을 추가하는 방법을 설명합니다.

## 목차

- [i18n 시스템 개요](#i18n-시스템-개요)
- [번역 키 추가](#번역-키-추가)
- [컴포넌트에서 사용](#컴포넌트에서-사용)
- [동적 번역](#동적-번역)
- [모범 사례](#모범-사례)

## i18n 시스템 개요

이 프로젝트는 **i18next**와 **react-i18next**를 사용하여 다국어를 지원합니다.

### 지원 언어

- 한국어 (ko)
- 영어 (en)
- 일본어 (ja)

### 번역 파일 위치

번역 파일은 `src/i18n/locales/` 디렉토리에 있습니다:

```
src/i18n/locales/
├── ko.json  # 한국어
├── en.json  # 영어
└── ja.json  # 일본어
```

## 번역 키 추가

### 1. JSON 구조

번역 파일은 중첩된 객체 구조를 사용합니다:

```json
{
  "section": {
    "title": "제목",
    "subtitle": "부제목",
    "button": {
      "primary": "주요 버튼",
      "secondary": "보조 버튼"
    }
  }
}
```

### 2. 모든 언어에 추가

모든 언어 파일에 동일한 키 구조로 번역을 추가합니다:

**ko.json:**
```json
{
  "contact": {
    "title": "연락하기",
    "form": {
      "name": "이름",
      "email": "이메일",
      "submit": "제출하기"
    }
  }
}
```

**en.json:**
```json
{
  "contact": {
    "title": "Contact",
    "form": {
      "name": "Name",
      "email": "Email",
      "submit": "Submit"
    }
  }
}
```

**ja.json:**
```json
{
  "contact": {
    "title": "お問い合わせ",
    "form": {
      "name": "名前",
      "email": "メール",
      "submit": "送信"
    }
  }
}
```

## 컴포넌트에서 사용

### 1. useTranslation 훅 사용

```typescript
import { useTranslation } from 'react-i18next'

function ContactForm() {
  const { t } = useTranslation()
  
  return (
    <form>
      <label>{t('contact.form.name')}</label>
      <input type="text" />
      
      <label>{t('contact.form.email')}</label>
      <input type="email" />
      
      <button type="submit">{t('contact.form.submit')}</button>
    </form>
  )
}
```

### 2. 네임스페이스 사용 (선택사항)

큰 프로젝트의 경우 네임스페이스를 사용할 수 있습니다:

```typescript
const { t } = useTranslation('contact')

// 네임스페이스를 사용하면 키를 짧게 쓸 수 있습니다
t('form.name') // 'contact.form.name'과 동일
```

## 동적 번역

### 1. 변수 삽입

번역 문자열에 변수를 삽입할 수 있습니다:

**번역 파일:**
```json
{
  "greeting": "안녕하세요, {{name}}님!"
}
```

**컴포넌트:**
```typescript
const { t } = useTranslation()

return <p>{t('greeting', { name: '홍길동' })}</p>
// 출력: "안녕하세요, 홍길동님!"
```

### 2. 복수형 처리

i18next는 복수형을 자동으로 처리합니다:

**번역 파일:**
```json
{
  "item": "항목",
  "item_plural": "항목들",
  "item_0": "항목 없음"
}
```

**컴포넌트:**
```typescript
const { t } = useTranslation()

t('item', { count: 0 })  // "항목 없음"
t('item', { count: 1 })  // "항목"
t('item', { count: 5 })  // "항목들"
```

## 모범 사례

### 1. 키 네이밍

- **명확하고 설명적**: `button.submit`보다 `form.button.submit`이 더 명확합니다
- **일관성**: 유사한 기능은 유사한 키 구조를 사용하세요
- **계층 구조**: 관련된 키는 그룹화하세요

### 2. 번역 파일 관리

- **모든 언어 동기화**: 모든 언어 파일에 동일한 키를 유지하세요
- **누락 확인**: 새 키를 추가할 때 모든 언어에 추가했는지 확인하세요
- **주석 사용**: 복잡한 번역에는 주석을 추가하세요

### 3. 성능

- **필요한 번역만 로드**: 큰 번역 파일은 네임스페이스로 분리하세요
- **캐싱**: i18next는 자동으로 번역을 캐싱합니다

### 4. 접근성

- **언어 변경**: 사용자가 언어를 쉽게 변경할 수 있도록 하세요
- **RTL 지원**: 필요시 RTL(오른쪽에서 왼쪽) 언어를 지원하세요

## 관련 문서

- [i18n System 설명](../explanation/i18n-system.md) - i18n 시스템 상세 설명
- [Add New Page](./add-new-page.md) - 새 페이지 추가 가이드


