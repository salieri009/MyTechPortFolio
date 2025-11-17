# Component Refactoring Status

> **Version**: 1.0.0  
> **Date**: 2025-11-15  
> **Status**: In Progress

## Completed Refactoring

### ✅ Naming Convention Cleanup
- ❌ `Header.tsx` → ✅ `MainHeader.tsx` (사용 중)
- ❌ `NewHeader.tsx` → 삭제됨
- ❌ `ProjectCard_fixed.tsx` → 삭제됨
- ❌ `ProjectShowcaseSection_new.tsx` → 삭제됨
- ❌ `ProjectsPage_fixed.tsx` → 삭제됨
- ❌ `ProjectsPage_new.tsx` → 삭제됨
- ❌ `ko_new.json` → 삭제됨
- ❌ `en_fixed.json` → 삭제됨
- ❌ `ja_fixed.json` → 삭제됨

## Component Analysis

### ProjectCard vs FeaturedProjectCard

**Current Status**: 두 컴포넌트는 서로 다른 용도로 사용됨

#### ProjectCard
- **Location**: `components/project/ProjectCard.tsx`
- **Usage**: `ProjectsPage.tsx` (일반 프로젝트 목록)
- **Style**: 간단한 카드 레이아웃
- **Features**: 
  - 기본 프로젝트 정보 표시
  - Tech stack 태그
  - Analytics tracking

#### FeaturedProjectCard
- **Location**: `components/project/FeaturedProjectCard.tsx`
- **Usage**: `HomePage.tsx` (특별 프로젝트 강조)
- **Style**: 큰 그리드 레이아웃 (2열)
- **Features**:
  - "Featured Project" 배지
  - 더 큰 이미지
  - CTA 버튼
  - 더 많은 시각적 강조

**Decision**: 
- 두 컴포넌트는 목적이 다르므로 분리 유지
- 향후 `ProjectCard`에 `variant` prop 추가하여 통합 가능성 검토

## Pending Refactoring

### 🔄 Component Consolidation
1. **ProjectCard 통합 검토**
   - `variant` prop 추가 (`default` | `featured`)
   - 공통 로직 추출
   - 스타일 통합

2. **ProjectShowcaseSection 검토**
   - 현재 하나의 파일만 존재
   - 구조 최적화 필요

### 📋 Atomic Design Migration
- [ ] Atoms 폴더 구조 생성
- [ ] Molecules 폴더 구조 생성
- [ ] Organisms 폴더 구조 생성
- [ ] Templates 폴더 구조 생성
- [ ] 점진적 마이그레이션

---

**Last Updated**: 2025-11-15

