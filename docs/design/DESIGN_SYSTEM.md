# Design System 설계서

## 1. 설계 원칙

| 원칙 | 설명 |
|------|------|
| 일관성 | 단일 디자인 토큰 시스템(`theme.ts`)으로 모든 컴포넌트 스타일 통일 |
| 접근성 | WCAG 2.1 AA 준수, Skip-to-Content, ARIA 속성, 키보드 내비게이션 |
| 반응형 | 모바일 퍼스트(475px~1536px), 6단계 Breakpoint 시스템 |

- **디자인 컨셉:** DevOps-themed 전문적 미학
- **스타일링:** Styled Components (CSS-in-JS)
- **시각 효과:** Glassmorphism + Neumorphism 액센트
- **레이아웃 전략:** F-Pattern / Z-Pattern (채용담당자 시선 최적화)

---

## 2. 컬러

### 2.1 Primary (Electric Blue — CTA 전용)

| 단계 | Hex 코드 | 용도 |
|------|----------|------|
| 50 | `#eff6ff` | 배경 하이라이트 |
| 100 | `#dbeafe` | 호버 배경 |
| 200 | `#bfdbfe` | 가벼운 액센트 |
| 300 | `#93c5fd` | 보조 액센트 |
| 400 | `#60a5fa` | 호버 상태 |
| **500** | **`#3b82f6`** | **메인 브랜드 컬러 (CTA 버튼, 링크)** |
| 600 | `#2563eb` | 클릭/Active 상태 |
| 700 | `#1d4ed8` | 강조 텍스트 |
| 800 | `#1e40af` | 다크 모드 액센트 |
| 900 | `#1e3a8a` | 최고 강조 |
| 950 | `#172554` | 다크 배경 |

### 2.2 Neutral (Slate Gray — 전문적 기술 팔레트)

| 단계 | Hex 코드 | 용도 |
|------|----------|------|
| 0 | `#ffffff` | 라이트 모드 배경 |
| 50 | `#f8fafc` | 라이트 모드 Surface |
| 100 | `#f1f5f9` | 라이트 모드 Divider |
| 200 | `#e2e8f0` | 라이트 모드 Border |
| 300 | `#cbd5e1` | 비활성 텍스트 |
| 400 | `#94a3b8` | Muted 텍스트 |
| 500 | `#64748b` | 보조 텍스트 |
| 600 | `#475569` | 라이트 모드 Secondary 텍스트 |
| 700 | `#334155` | 다크 모드 Border |
| 800 | `#1e293b` | 다크 모드 Surface |
| 900 | `#0f172a` | 다크 모드 배경 |
| 950 | `#020617` | 최고 다크 |

### 2.3 Semantic

| 용도 | Hex 코드 | 사용처 |
|------|----------|--------|
| Success | `#10b981` | 성공 알림, 완료 상태 Badge |
| Warning | `#f59e0b` | 경고 알림, 주의 상태 Badge |
| Error | `#ef4444` | 에러 메시지, 삭제 버튼 |
| Info | `#38bdf8` | 정보 알림, Primary 액센트 |

### 2.4 테마 시맨틱 컬러

| 속성 | Light Mode | Dark Mode |
|------|-----------|-----------|
| background | `#ffffff` | `#0f172a` |
| surface | `#f8fafc` | `#1e293b` |
| text | `#0f172a` | `#f8fafc` |
| textSecondary | `#475569` | `#94a3b8` |
| textMuted | `#64748b` | `#64748b` |
| border | `#e2e8f0` | `#334155` |
| divider | `#f1f5f9` | `#1e293b` |

### 2.5 그라디언트

| 이름 | 값 | 용도 |
|------|-----|------|
| primary | `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)` | CTA 버튼, 강조 영역 |
| dark | `linear-gradient(135deg, #1f2937 0%, #111827 100%)` | 다크 배경 카드 |

### 2.6 Glassmorphism

| 강도 | 값 | 용도 |
|------|-----|------|
| light | `rgba(255, 255, 255, 0.1)` | 가벼운 유리 효과 |
| medium | `rgba(255, 255, 255, 0.2)` | 카드 배경 |
| strong | `rgba(255, 255, 255, 0.3)` | 모달 배경 |

---

## 3. 타이포그래피

### 3.1 폰트

- **기본 폰트:** `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **단일 폰트 원칙:** KickoffLabs 가이드라인에 따라 1개 폰트 패밀리만 사용

### 3.2 크기

| 용도 | 키 | rem | px | 비고 |
|------|-----|-----|-----|------|
| 캡션 | xs | 0.75rem | 12px | 최소 허용 크기 |
| 보조 텍스트 | sm | 0.875rem | 14px | |
| 본문 (기본) | base | 1rem | 16px | 기본 크기 |
| 강조 본문 | lg | 1.125rem | 18px | |
| 소제목 | xl | 1.25rem | 20px | |
| 섹션 제목 | 2xl | 1.5rem | 24px | |
| 페이지 제목 | 3xl | 1.875rem | 30px | |
| Hero 소제목 | 4xl | 2.25rem | 36px | |
| Hero 제목 | 5xl | 3rem | 48px | |
| 대형 Hero | 6xl | 3.75rem | 60px | |

### 3.3 Font Weight

| 키 | 값 | 용도 |
|----|-----|------|
| light | 300 | 보조 텍스트 |
| normal | 400 | 본문 |
| medium | 500 | 강조 본문, 네비게이션 |
| semibold | 600 | 부제목, 버튼 |
| bold | 700 | 제목 |
| extrabold | 800 | Hero 텍스트 |

### 3.4 Line Height

| 키 | 값 | 용도 |
|----|-----|------|
| tight | 1.25 | 제목 |
| snug | 1.375 | 소제목 |
| normal | 1.5 | 본문 |
| relaxed | 1.625 | 넓은 본문 |

---

## 4. 간격 (4px 기반 그리드)

| 용도 | 키 | px |
|------|-----|-----|
| 인라인 최소 간격 | 1 | 4px |
| 아이콘-텍스트 간격 | 2 | 8px |
| 컴포넌트 내부 패딩 | 3 | 12px |
| 카드 내부 패딩 | 4 | 16px |
| 섹션 내부 간격 | 6 | 24px |
| 컴포넌트 간 간격 | 8 | 32px |
| 섹션 간 간격 | 12 | 48px |
| 페이지 상하 패딩 | 16 | 64px |
| 대형 섹션 간격 | 24 | 96px |

---

## 5. Breakpoints

| 이름 | 값 | 대상 |
|------|-----|------|
| xs | 475px | 모바일 |
| sm | 640px | 대형 모바일 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 대형 데스크톱 |
| 2xl | 1536px | 와이드 모니터 |

---

## 6. 컴포넌트

### 6.1 Button

- **크기:** sm(32px), md(40px), lg(48px)
- **변형:** primary(#3b82f6 배경), secondary(투명 + border), ghost(투명), danger(#ef4444)
- **Border Radius:** md (6px)
- **반응형:** 모바일에서 full-width 옵션

### 6.2 Card

- **패딩:** 16px (spacing.4)
- **Border Radius:** lg (8px)
- **배경:** surface 컬러
- **Shadow:** sm 또는 base
- **호버:** shadow-md + 미세 scale(1.02)

### 6.3 Input/Form Field

- **높이:** 40px
- **Border:** 1px solid border 컬러
- **Border Radius:** md (6px)
- **포커스:** primary-500 테두리 + glow 효과
- **에러:** error 테두리 + 에러 메시지 (sm 크기)

### 6.4 Modal

- **Overlay:** rgba(0,0,0,0.5)
- **z-index:** 1400 (modal)
- **Border Radius:** xl (12px)
- **최대 너비:** 640px
- **Body 스크롤 잠금 + 포커스 트랩**

### 6.5 Badge (상태 표시)

- **Border Radius:** full (9999px)
- **패딩:** 4px 12px
- **크기:** sm 텍스트
- **색상 매핑:** semantic 컬러 기반

### 6.6 Toast

- **z-index:** 1700
- **위치:** 우측 상단
- **애니메이션:** slideIn (300ms)
- **자동 닫힘:** 5초

---

## 7. Shadow 시스템

| 키 | 값 | 용도 |
|----|-----|------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | 카드 기본 |
| base | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)` | 일반 엘리먼트 |
| md | `0 4px 6px rgba(0,0,0,0.1)` | 호버 상태 |
| lg | `0 10px 15px rgba(0,0,0,0.1)` | 드롭다운, 팝오버 |
| xl | `0 20px 25px rgba(0,0,0,0.1)` | 모달 |

**Glow 효과:**
- primary: `0 0 20px rgba(59, 130, 246, 0.5)`
- neon: `0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6)`

**Neumorphism:**
- light: `6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff`
- dark: `6px 6px 12px #0a0a0a, -6px -6px 12px #2a2a2a`

---

## 8. 애니메이션

| 키 | 값 | 용도 |
|----|-----|------|
| fastest | 100ms | 호버 색상 전환 |
| fast | 200ms | 버튼 상태 전환 |
| normal | 300ms | 페이지 전환, 모달 열기 |
| slow | 500ms | 레이아웃 변경 |
| slowest | 1000ms | Hero 애니메이션 |

**Easing:**
- `inOut: cubic-bezier(0.4, 0, 0.2, 1)` — 기본 전환 (가장 많이 사용)
- `bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)` — 탄성 효과
- `elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6)` — 스프링 효과

---

## 9. Z-Index 스케일

| 키 | 값 | 용도 |
|----|-----|------|
| base | 0 | 기본 컨텐츠 |
| docked | 10 | 고정 요소 |
| dropdown | 1000 | 드롭다운 메뉴 |
| sticky | 1100 | 고정 헤더 |
| banner | 1200 | 배너 알림 |
| overlay | 1300 | 오버레이 배경 |
| modal | 1400 | 모달 |
| popover | 1500 | 팝오버 |
| skipLink | 1600 | Skip-to-Content |
| toast | 1700 | 토스트 알림 |
| tooltip | 1800 | 툴팁 |

---

## 10. Border Radius

| 키 | 값 | 용도 |
|----|-----|------|
| none | 0px | 직각 |
| sm | 2px | 미세 라운딩 |
| base | 4px | 기본 |
| md | 6px | 버튼, 입력 필드 |
| lg | 8px | 카드 |
| xl | 12px | 모달 |
| 2xl | 16px | 대형 카드 |
| 3xl | 24px | 특수 컴포넌트 |
| full | 9999px | 원형 (Badge, Avatar) |

---

## 11. 반응형 전략

### 11.1 모바일 퍼스트 접근

- 기본 스타일: 모바일 기준으로 작성
- `@media (min-width: ${breakpoint})` 로 상위 Breakpoint 추가
- Styled Components `ThemeProvider`를 통해 테마 객체에서 breakpoint 참조

### 11.2 주요 반응형 대응

| 영역 | 모바일 (< 768px) | 데스크톱 (>= 1024px) |
|------|-----------------|---------------------|
| 네비게이션 | 햄버거 메뉴 | 전체 Header 네비게이션 |
| 프로젝트 그리드 | 1열 카드 | 2~3열 그리드 |
| Hero 텍스트 | 3xl (30px) | 5xl~6xl (48~60px) |
| 사이드바 (Admin) | 접힘 | 확장 |
| Footer | 단일 열 스택 | 다열 그리드 |

### 11.3 Admin 레이아웃

- **사이드바:** 확장 시 240px, 축소 시 64px
- **Header:** 64px 높이
- **콘텐츠 영역:** 최대 너비 1280px, 좌우 패딩 24px

---

## 12. 접근성 기준

| 항목 | 구현 |
|------|------|
| Skip-to-Content | `SkipToContent` 컴포넌트로 메인 콘텐츠 바로가기 |
| 포커스 관리 | 모달 열기/닫기 시 포커스 트랩 및 복귀 (A11y Focus Return) |
| ARIA 속성 | 인터랙티브 요소에 `aria-label`, `role` 속성 |
| 키보드 네비게이션 | Tab, Enter, Escape 키 지원 |
| 색상 대비 | Semantic 컬러 WCAG AA 대비율 준수 |
| 대체 텍스트 | 이미지에 `altText` 필드 제공 |
