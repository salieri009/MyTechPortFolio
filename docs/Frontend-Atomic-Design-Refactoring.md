# Frontend Atomic Design Refactoring Plan

> **Version**: 1.0.0  
> **Date**: 2025-11-15  
> **Status**: Planning Phase

## 현재 구조 분석

### 현재 컴포넌트 구조

```
frontend/src/components/
├── ui/                    # Atoms (기본 UI 요소)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Tag.tsx
│   ├── Typography.tsx
│   ├── Breadcrumbs.tsx
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   ├── SuccessMessage.tsx
│   ├── ConfirmationDialog.tsx
│   └── Container.tsx
├── layout/                # Organisms (레이아웃)
│   ├── Header.tsx
│   ├── MainHeader.tsx
│   ├── NewHeader.tsx      # 중복!
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── footer/            # Footer Molecules
│       ├── FooterBranding.tsx
│       ├── FooterNav.tsx
│       ├── FooterContact.tsx
│       ├── FooterSocial.tsx
│       ├── FooterLegal.tsx
│       ├── FooterCTA.tsx
│       └── MobileFooter.tsx
├── project/               # Molecules/Organisms
│   ├── ProjectCard.tsx
│   ├── ProjectCard_fixed.tsx  # 중복!
│   └── FeaturedProjectCard.tsx
├── sections/              # Organisms
│   ├── ProjectShowcaseSection.tsx
│   ├── ProjectShowcaseSection_new.tsx  # 중복!
│   ├── JourneyMilestoneSection.tsx
│   ├── TechStackSection.tsx
│   └── TechIcon.tsx
├── recruiter/             # Organisms
│   ├── PersonalInfoHeader.tsx
│   └── CareerSummaryDashboard.tsx
├── testimonials/          # Molecules
│   └── TestimonialCard.tsx
├── common/                # 공통 컴포넌트
│   └── FooterComponents.tsx
├── ThemeToggle/           # Molecules
│   └── ThemeToggle.tsx
├── LanguageSwiper/        # Molecules
│   └── LanguageSwiper.tsx
├── Typewriter/            # Molecules
│   └── Typewriter.tsx
└── AdvancedTypewriter/    # Molecules
    └── AdvancedTypewriter.tsx
```

## 문제점

1. **중복 컴포넌트**: `Header.tsx`, `MainHeader.tsx`, `NewHeader.tsx` / `ProjectCard.tsx`, `ProjectCard_fixed.tsx` / `ProjectShowcaseSection.tsx`, `ProjectShowcaseSection_new.tsx`
2. **일관성 없는 구조**: 일부는 폴더로, 일부는 파일로 구성
3. **Atomic Design 미준수**: atoms, molecules, organisms 구분이 명확하지 않음
4. **재사용성 부족**: 유사한 컴포넌트가 여러 곳에 분산

## 목표 구조 (Atomic Design)

```
frontend/src/components/
├── atoms/                  # 가장 작은 단위 컴포넌트
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── index.ts
│   ├── Card/
│   ├── Tag/
│   ├── Typography/
│   ├── Input/
│   ├── Icon/
│   ├── Badge/
│   └── index.ts
├── molecules/             # Atoms의 조합
│   ├── ProjectCard/
│   │   ├── ProjectCard.tsx
│   │   └── index.ts
│   ├── TechStackBadge/
│   ├── StatCard/
│   ├── ContactButton/
│   ├── TestimonialCard/
│   ├── ThemeToggle/
│   ├── LanguageSwiper/
│   ├── Breadcrumbs/
│   └── index.ts
├── organisms/             # Molecules의 조합
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── FooterBranding.tsx
│   │   ├── FooterNav.tsx
│   │   ├── FooterContact.tsx
│   │   ├── FooterSocial.tsx
│   │   ├── FooterLegal.tsx
│   │   ├── FooterCTA.tsx
│   │   ├── MobileFooter.tsx
│   │   └── index.ts
│   ├── ProjectShowcase/
│   │   ├── ProjectShowcaseSection.tsx
│   │   └── index.ts
│   ├── JourneyMilestone/
│   ├── TechStackSection/
│   ├── PersonalInfoHeader/
│   ├── CareerSummaryDashboard/
│   └── index.ts
├── templates/             # 페이지 레이아웃 템플릿
│   ├── PageTemplate/
│   ├── ProjectPageTemplate/
│   └── index.ts
└── index.ts               # 전체 export
```

## 마이그레이션 계획

### Phase 1: Atoms 정리
1. `ui/` → `atoms/`로 이동
2. 각 컴포넌트를 폴더 구조로 변경
3. `index.ts` 추가

### Phase 2: Molecules 생성
1. `ProjectCard` 통합 및 `molecules/`로 이동
2. `TechStackBadge` 생성
3. `StatCard` 생성
4. `ContactButton` 생성
5. 기타 molecules 정리

### Phase 3: Organisms 정리
1. Header 통합 (중복 제거)
2. Footer 구조 정리
3. Sections를 organisms로 이동
4. Recruiter 컴포넌트 정리

### Phase 4: Templates 생성
1. 기본 페이지 템플릿 생성
2. 프로젝트 페이지 템플릿 생성

## 실행 전략

점진적 마이그레이션:
1. 새 구조로 컴포넌트 생성
2. 기존 컴포넌트를 새 구조로 이동
3. Import 경로 업데이트
4. 중복 컴포넌트 제거
5. 테스트 및 검증

---

**Next Steps**: Phase 1부터 시작하여 점진적으로 마이그레이션 진행

