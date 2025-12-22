# Internationalization (i18n) Implementation Details

## Overview

This project implements multi-language support using React i18next. It supports Korean (ko), English (en), and Japanese (ja), and automatically detects language based on browser settings.

## Technology Stack

- **i18next**: i18n engine
- **react-i18next**: React integration
- **i18next-browser-languagedetector**: Browser language detection

## Configuration

### Location
`src/i18n/config.ts`

### Basic Configuration

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

## Translation File Structure

### Location
`src/i18n/locales/`

### File Structure

```
locales/
├── ko.json    # Korean
├── en.json    # English
└── ja.json    # Japanese
```

### JSON Structure Example

```json
{
  "navigation": {
    "home": "Home",
    "projects": "Projects",
    "about": "About"
  },
  "hero": {
    "greeting": "Hello",
    "name": "John Doe",
    "headline": "Full Stack Developer"
  }
}
```

## Usage

### useTranslation Hook

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.greeting', { name: 'John' })}</p>
    </div>
  )
}
```

### Basic Translation

```typescript
t('navigation.home')  // "Home"
```

### Providing Default Value

```typescript
t('navigation.home', 'Home')  // Returns "Home" if key doesn't exist
```

### Variable Interpolation

```typescript
// Translation file
{
  "greeting": "Hello, {{name}}"
}

// Usage
t('greeting', { name: 'John' })  // "Hello, John"
```

### Pluralization

```typescript
// Translation file
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}

// Usage
t('items', { count: 1 })   // "1 item"
t('items', { count: 5 })   // "5 items"
```

## Language Switching

### LanguageSwitcher Component

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

### Language Detection Order

1. **localStorage**: Previously selected language
2. **navigator**: Browser language setting
3. **htmlTag**: HTML lang attribute

## Namespaces

### Purpose
Logically separate translation files for management

### Configuration

```typescript
i18n.init({
  defaultNS: 'translation',
  ns: ['translation', 'common', 'errors']
})
```

### Usage

```typescript
t('key', { ns: 'common' })
```

## Dynamic Loading

### Load Translation Files On Demand

```typescript
import(`./locales/${language}.json`).then(resources => {
  i18n.addResourceBundle(language, 'translation', resources)
})
```

## Type Safety

### Translation Key Type Definition

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

This enables TypeScript to auto-complete translation keys and perform type checking.

## Best Practices

### 1. Key Naming
- Use hierarchical structure (`section.subsection.key`)
- Use meaningful key names

```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Full Stack Developer"
  }
}
```

### 2. Avoid Key Duplication
- Separate common text into separate namespaces
- Define reusable keys

### 3. Consider Context
- Same word may require different translations based on context
- Include context in keys

```json
{
  "button": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "form": {
    "submit": "Submit Form",
    "cancel": "Cancel Form"
  }
}
```

### 4. HTML Escaping
- HTML is escaped by default
- Use `dangerouslySetInnerHTML` if HTML is needed (use with caution)

## Debugging

### Development Mode

```typescript
i18n.init({
  debug: process.env.NODE_ENV === 'development'
})
```

In debug mode:
- Missing key warnings
- Language detection process logs
- Detailed translation process information

## Performance Optimization

### 1. Optimize Translation File Size
- Remove unused translations
- Remove duplicates

### 2. Lazy Loading
- Load only required languages
- Utilize dynamic imports

### 3. Memoization
- Cache translation results
- Prevent unnecessary recalculation

## Currently Supported Languages

| Language | Code | File |
|----------|------|------|
| Korean | ko | `ko.json` |
| English | en | `en.json` |
| Japanese | ja | `ja.json` |

## How to Add a Language

### 1. Create Translation File

Create `src/i18n/locales/[language].json` file

### 2. Update Configuration

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

### 3. Update LanguageSwitcher

Add new language option

## References

- [React i18next Official Documentation](https://react.i18next.com/)
- [i18next Official Documentation](https://www.i18next.com/)
