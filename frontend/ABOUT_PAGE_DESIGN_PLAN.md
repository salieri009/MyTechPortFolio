# About Page 상세 디자인 계획

## 참고 자료
- [Kinsta: 30 Examples of Stellar About Us Pages](https://kinsta.com/blog/about-us-page/)
- 기존 프롬프트 규칙 준수:
  - 4-point spacing system
  - KickoffLabs 가이드라인 (색상, 폰트 일관성)
  - Nielsen's 10 Usability Heuristics
  - 프론트엔드 개발자 포트폴리오 디자인 프롬프트

## 1. About Us 페이지의 핵심 구성 요소 (Kinsta 기준)

### 1.1 회사 설립 스토리 (Why)
- **목적**: 회사가 설립된 이유와 영감의 순간 공유
- **내용**: 
  - 개발자로서의 여정 시작점
  - 문제 해결에 대한 열정
  - 포트폴리오를 만든 동기
- **디자인**: 
  - Z-pattern 레이아웃 적용
  - 좌측: 텍스트 스토리
  - 우측: 시각적 요소 (타임라인 시작점, 초기 프로젝트 이미지)

### 1.2 배경 및 창립팀 역할 (Who)
- **목적**: 개인 배경과 전문성 소개
- **내용**:
  - 교육 배경 (전북대학교, UTS)
  - 경력 하이라이트
  - 핵심 기술 스택
  - 개인적 가치관
- **디자인**:
  - F-pattern 레이아웃
  - 좌측: 텍스트 기반 정보
  - 우측: 시각적 타임라인 또는 기술 스택 시각화

### 1.3 회사 진화 과정 (How)
- **목적**: 성장 과정과 주요 마일스톤 문서화
- **내용**:
  - 학업 과정 (2024-2025)
  - 주요 프로젝트 진화
  - 기술 스택 확장
  - 학습 여정
- **디자인**:
  - 인터랙티브 타임라인 (기존 JourneyMilestoneSection 활용)
  - 스크롤 트리거 애니메이션
  - 프로젝트 카드와 연결

### 1.4 미션과 비전 (What)
- **목적**: 해결하려는 문제와 미래 방향성
- **내용**:
  - 개발자로서의 미션
  - 기술적 비전
  - 커뮤니티 기여 목표
- **디자인**:
  - 강조된 섹션 (CTA 포함)
  - 아이콘 기반 가치관 표현 (Bird 스타일)
  - 시각적 다리(visual bridge)로 Contact 섹션 연결

## 2. 페이지 구조 및 레이아웃

### 2.1 Hero Section (About Hero)
```
┌─────────────────────────────────────┐
│  [로고/네비게이션]                    │ ← Z-pattern 시작
│                                     │
│  [큰 제목: "About Me"]              │ ← 좌상단
│  [서브타이틀: 개인 브랜딩]            │
│                                     │
│  [프로필 이미지/아바타]               │ ← 우상단
│                                     │
│  [간단한 소개 문구]                   │ ← 좌하단
│  [CTA: "View My Work"]              │ ← 우하단
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- Primary 색상 배경 (기존 Hero와 일관성)
- 4-point spacing system 준수
- 스크롤 인디케이터 (다음 섹션으로 유도)

### 2.2 Story Section (설립 스토리)
```
┌─────────────────────────────────────┐
│  [섹션 타이틀: "My Journey"]        │
│                                     │
│  [텍스트 블록]                        │ ← F-pattern: 좌측
│  - 시작점                            │
│  - 동기                              │
│  - 열정                              │
│                                     │
│  [시각적 요소]                        │ ← F-pattern: 우측
│  - 타임라인 시작점                    │
│  - 초기 프로젝트 이미지                │
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- 12-column grid system
- 좌측: 7 columns (텍스트)
- 우측: 5 columns (시각적 요소)
- 스크롤 트리거 fade-in 애니메이션

### 2.3 Background Section (배경 및 전문성)
```
┌─────────────────────────────────────┐
│  [섹션 타이틀: "Background & Skills"]│
│                                     │
│  [교육] [경력] [기술]                 │ ← 카드 레이아웃
│                                     │
│  [상세 정보]                          │
│  - 전북대학교 컴퓨터공학              │
│  - UTS 유학 중                        │
│  - 주요 기술 스택                     │
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- 모듈식 카드 레이아웃
- 3-column grid (데스크톱)
- 호버 효과 (그림자, transform)
- 4-point spacing 일관성

### 2.4 Evolution Timeline (진화 과정)
```
┌─────────────────────────────────────┐
│  [섹션 타이틀: "Growth Journey"]     │
│                                     │
│  [기존 JourneyMilestoneSection 활용] │
│  - 2024 Spring                      │
│  - 2024 Autumn                      │
│  - 2025 Spring (현재)                │
│  - 주요 프로젝트 마일스톤             │
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- 기존 JourneyMilestoneSection 재사용
- F-pattern 레이아웃 유지
- 스크롤 트리거 순차 애니메이션

### 2.5 Mission & Vision Section (미션과 비전)
```
┌─────────────────────────────────────┐
│  [섹션 타이틀: "Mission & Vision"]  │
│                                     │
│  [아이콘] [가치관 1]                 │ ← Bird 스타일
│  [아이콘] [가치관 2]                 │
│  [아이콘] [가치관 3]                 │
│                                     │
│  [미션 문구]                          │
│  [비전 문구]                          │
│                                     │
│  [CTA 버튼: "Let's Connect"]        │
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- 아이콘 기반 가치관 표현
- Primary 색상 CTA 버튼
- 시각적 다리로 Contact 섹션 연결

### 2.6 Contact Section (연락처)
```
┌─────────────────────────────────────┐
│  [섹션 타이틀: "Let's Connect"]     │
│                                     │
│  [연락처 정보 카드]                   │
│  - 이메일                            │
│  - LinkedIn                          │
│  - GitHub                            │
│                                     │
│  [CTA 버튼들]                        │
│  - 이메일 보내기                      │
│  - LinkedIn 연결                     │
└─────────────────────────────────────┘
```

**디자인 요구사항**:
- 기존 ContactSection 스타일 유지
- 4-point spacing 준수
- 접근성 향상 (ARIA, 키보드 네비게이션)

## 3. 디자인 시스템 준수 사항

### 3.1 4-Point Spacing System
- 모든 spacing 값은 4px의 배수
- `theme.spacing` 사용 (하드코딩 금지)
- 예: `spacing[4]` (16px), `spacing[6]` (24px), `spacing[8]` (32px)

### 3.2 KickoffLabs 가이드라인
- **색상**: Primary + Neutral만 사용
- **폰트**: Inter 폰트 패밀리만 사용 (`theme.typography.fontFamily.primary`)
- **CTA**: Primary 색상만 사용 (버튼, 링크)
- **일관성**: 모든 버튼, 패딩, border-radius 일관된 스타일

### 3.3 Nielsen's Heuristics
- **H1: Visibility of System Status**
  - 스크롤 진행 표시
  - 섹션 전환 애니메이션
  - 호버/포커스 피드백
- **H3: User Control & Freedom**
  - 키보드 네비게이션 지원
  - 포커스 상태 명확히 표시
  - 뒤로가기/앞으로가기 지원
- **H4: Consistency & Standards**
  - 다른 페이지와 일관된 디자인
  - 표준 UI 패턴 사용
- **H8: Aesthetic & Minimalist Design**
  - 불필요한 요소 제거
  - 여백 활용
  - 시각적 계층 구조

### 3.4 포트폴리오 디자인 프롬프트
- **Z-pattern**: Hero 섹션
- **F-pattern**: Story, Background 섹션
- **12-column grid**: 모든 섹션
- **스크롤 트리거 애니메이션**: 섹션 진입 시
- **마이크로인터랙션**: 호버, 포커스 효과
- **시각적 다리**: 섹션 간 전환

## 4. 컴포넌트 구조

### 4.1 AboutPage.tsx
```typescript
- AboutHero (새로 생성)
- StorySection (새로 생성)
- BackgroundSection (기존 ContactSection 개선)
- JourneyMilestoneSection (기존 재사용)
- MissionVisionSection (새로 생성)
- ContactSection (기존 개선)
```

### 4.2 새로운 컴포넌트

#### AboutHero.tsx
- Hero 섹션 스타일
- 프로필 이미지/아바타
- 간단한 소개 문구
- CTA 버튼

#### StorySection.tsx
- F-pattern 레이아웃
- 텍스트 블록 (좌측)
- 시각적 요소 (우측)
- 스크롤 트리거 애니메이션

#### MissionVisionSection.tsx
- 아이콘 기반 가치관 카드
- 미션/비전 텍스트
- CTA 버튼

## 5. 반응형 디자인

### 5.1 브레이크포인트
- **Mobile**: < 768px
  - 1-column 레이아웃
  - 스택된 카드
  - 축소된 타이포그래피
- **Tablet**: 768px - 1024px
  - 2-column 레이아웃
  - 중간 크기 타이포그래피
- **Desktop**: > 1024px
  - 12-column grid
  - F-pattern/Z-pattern 레이아웃
  - 전체 기능

### 5.2 모바일 최적화
- 터치 친화적 버튼 크기 (최소 44px)
- 스와이프 제스처 지원 (타임라인)
- 축소된 이미지
- 간소화된 네비게이션

## 6. 접근성 (Accessibility)

### 6.1 ARIA 속성
- `role="main"` (메인 콘텐츠)
- `aria-label` (섹션 설명)
- `aria-describedby` (관련 요소 연결)

### 6.2 키보드 네비게이션
- 모든 인터랙티브 요소 포커스 가능
- `focus-visible` 스타일 명확히
- Tab 순서 논리적

### 6.3 스크린 리더
- 의미론적 HTML 사용
- 적절한 heading 계층 (h1 → h2 → h3)
- 대체 텍스트 (이미지)

## 7. 성능 최적화

### 7.1 이미지 최적화
- Lazy loading
- WebP 포맷
- 반응형 이미지 (srcset)

### 7.2 애니메이션 최적화
- `will-change` 속성 사용
- GPU 가속 (`translateZ(0)`)
- `prefers-reduced-motion` 지원

## 8. 구현 우선순위

### Phase 1: 기본 구조
1. AboutHero 컴포넌트 생성
2. StorySection 컴포넌트 생성
3. 기존 ContactSection 개선

### Phase 2: 고급 기능
4. MissionVisionSection 생성
5. JourneyMilestoneSection 통합
6. 스크롤 트리거 애니메이션 추가

### Phase 3: 최적화
7. 반응형 디자인 완성
8. 접근성 개선
9. 성능 최적화

## 9. 참고 예시 (Kinsta 기준)

### HubSpot 스타일
- 비디오 포함 (선택사항)
- 미션 중심 오프닝

### Buffer 스타일
- 팀 중심 (개인 포트폴리오이므로 개인 중심)
- 사진/아바타 강조

### Bird 스타일
- 아이콘 기반 가치관 표현
- 시각적 계층 구조

### RXBAR 스타일
- "Then and Now" 슬라이더 (타임라인으로 구현)
- 회사 역사 강조

## 10. 체크리스트

### 디자인 시스템
- [ ] 4-point spacing system 준수
- [ ] Primary + Neutral 색상만 사용
- [ ] Inter 폰트만 사용
- [ ] CTA는 Primary 색상만

### 레이아웃
- [ ] Z-pattern (Hero)
- [ ] F-pattern (Story, Background)
- [ ] 12-column grid
- [ ] 반응형 디자인

### 접근성
- [ ] ARIA 속성
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] 포커스 상태 명확히

### 성능
- [ ] 이미지 최적화
- [ ] 애니메이션 최적화
- [ ] Lazy loading
- [ ] GPU 가속

### 사용자 경험
- [ ] 스크롤 트리거 애니메이션
- [ ] 마이크로인터랙션
- [ ] 시각적 다리
- [ ] 명확한 CTA

