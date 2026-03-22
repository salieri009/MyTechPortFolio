# Frontend Architecture Mapping

This reference maps Track 1/2 implementation to existing files.

## Likely Edit Targets

- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/HomePage.styles.ts`
- `frontend/src/i18n/locales/ko.json`
- `frontend/src/i18n/locales/en.json`
- `frontend/src/i18n/locales/ja.json`
- `frontend/src/store/themeStore.ts`
- `frontend/src/styles/theme.ts`
- `frontend/src/components/ThemeToggle/ThemeToggle.tsx`
- `frontend/src/App.tsx`
- `frontend/src/styles/GlobalStyle.ts`

## Track 1 Mapping

- Hero content hierarchy and interaction live in Home page and related styles.
- Language-dependent hero copy is stored in locale JSON files.
- Motion and accessibility behavior is influenced by global and component styles.

## Track 2 Mapping

- Theme mode state and persistence live in theme store.
- Token definitions live in theme file.
- Runtime theme wiring is in App theme provider usage.
- Toggle UX is in ThemeToggle and header composition.

## Validation Mapping

- Build/typecheck from frontend scripts.
- Manual checks across Home/About/Header/Footer/Theme Toggle.
- Responsive checks at 360/768/1280.
