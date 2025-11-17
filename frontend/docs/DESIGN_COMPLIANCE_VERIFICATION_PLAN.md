# 디자인 원칙 준수 검증 계획

> **검증 기준**: [KickoffLabs Landing Page Design Guide](https://kickofflabs.com/blog/landing-page-fonts-colors/) & [UX Planet 4-Point Spacing System](https://uxplanet.org/principles-of-spacing-in-ui-design-a-beginners-guide-to-the-4-point-spacing-system-6e88233b527a)  
> **작성 일자**: 2025-01-XX  
> **검증 범위**: 모든 페이지 및 주요 컴포넌트  
> **검증 방법론**: 체계적 파일 검토, 자동화 스크립트, 시각적 검증

---

## 📋 검증 목표

이 계획은 다음 두 가지 핵심 디자인 원칙을 모든 페이지에서 준수하는지 체계적으로 검증합니다:

1. **KickoffLabs 원칙**: 색상 팔레트 제한, 폰트 제한, CTA 색상 역할, 일관성
2. **4-Point Spacing 시스템**: 모든 spacing 값이 4px의 배수인지 확인

---

## 🎯 검증 범위

### 페이지 목록
- [ ] `HomePage.tsx` - 랜딩 페이지
- [ ] `AboutPage.tsx` - 소개 페이지
- [ ] `ProjectsPage.tsx` - 프로젝트 목록 페이지
- [ ] `ProjectDetailPage.tsx` - 프로젝트 상세 페이지
- [ ] `AcademicsPage.tsx` - 학업 기록 페이지
- [ ] `FeedbackPage.tsx` - 피드백 페이지
- [ ] `LoginPage.tsx` - 로그인 페이지

### 주요 컴포넌트 목록
- [ ] `MainHeader.tsx` - 메인 헤더
- [ ] `Footer.tsx` - 푸터
- [ ] `Button.tsx` - 버튼 컴포넌트
- [ ] `Card.tsx` - 카드 컴포넌트
- [ ] `Tag.tsx` - 태그 컴포넌트
- [ ] `ProjectCard.tsx` - 프로젝트 카드
- [ ] `FeaturedProjectCard.tsx` - 피처드 프로젝트 카드
- [ ] `HeroProjectCard.tsx` - 히어로 프로젝트 카드
- [ ] `TestimonialCard.tsx` - 추천사 카드
- [ ] `JourneyMilestoneSection.tsx` - 여정 마일스톤 섹션
- [ ] `StatCard.tsx` - 통계 카드
- [ ] `CustomSelect.tsx` - 커스텀 셀렉트
- [ ] `TechStackModal.tsx` - 기술 스택 모달

### 스타일 파일 목록
- [ ] `theme.ts` - 테마 시스템 (중앙 집중식)
- [ ] `HomePage.styles.ts` - 홈페이지 스타일
- [ ] `AboutPage.styles.ts` - 소개 페이지 스타일
- [ ] `ProjectsPage.styles.ts` - 프로젝트 페이지 스타일 (있는 경우)
- [ ] 기타 컴포넌트별 스타일 파일

---

## 🔍 검증 체크리스트

### 1. KickoffLabs 색상 팔레트 제한

**원칙**: 페이지당 1-3개 색상만 사용. CTA는 강한 색상 하나만 사용.

#### 검증 항목
- [ ] **Primary 색상 사용**: CTA 버튼에만 Primary 색상 사용
- [ ] **Neutral 색상 사용**: 배경, 텍스트, 테두리에 Neutral 색상만 사용
- [ ] **하드코딩 색상 제거**: `#` 또는 `rgb()` 직접 사용 금지
- [ ] **Semantic 색상**: Success, Warning, Error는 테마에서만 사용
- [ ] **그라데이션**: Primary 색상 변형만 사용

#### 검증 방법
```bash
# 하드코딩된 색상 검색
grep -r "#[0-9a-fA-F]\{6\}" frontend/src --include="*.tsx" --include="*.ts"
grep -r "rgb(" frontend/src --include="*.tsx" --include="*.ts"
grep -r "rgba(" frontend/src --include="*.tsx" --include="*.ts"

# 테마 색상 사용 확인
grep -r "theme.colors" frontend/src --include="*.tsx" --include="*.ts"
```

#### 예상 발견 사항
- 일부 컴포넌트에서 하드코딩된 색상 사용 가능성
- 테마 색상 미사용 컴포넌트

---

### 2. KickoffLabs 폰트 제한

**원칙**: 1개 폰트 패밀리만 사용 (디자이너는 최대 2개).

#### 검증 항목
- [ ] **단일 폰트 패밀리**: Inter만 사용
- [ ] **테마 폰트 사용**: `theme.typography.fontFamily.primary` 사용
- [ ] **하드코딩 폰트 제거**: `font-family` 직접 지정 금지
- [ ] **폰트 스타일 변형**: bold, italic, weight만 사용

#### 검증 방법
```bash
# 하드코딩된 폰트 검색
grep -r "font-family:" frontend/src --include="*.tsx" --include="*.ts" | grep -v "theme.typography"
grep -r "Arial\|Helvetica\|Verdana\|Times" frontend/src --include="*.tsx" --include="*.ts"
```

#### 예상 발견 사항
- 일부 컴포넌트에서 하드코딩된 폰트 사용 가능성
- 테마 폰트 미사용 컴포넌트

---

### 3. KickoffLabs CTA 색상 역할

**원칙**: CTA 버튼은 Primary 색상만 사용. 보조 색상은 보완적 역할만.

#### 검증 항목
- [ ] **Primary CTA**: `primary[500]` 또는 `primary[600]` 사용
- [ ] **Secondary CTA**: 투명 배경 + 테두리 또는 Neutral 색상
- [ ] **CTA 일관성**: 모든 페이지에서 동일한 CTA 스타일
- [ ] **대비 비율**: WCAG AA 기준 충족 (4.5:1 이상)

#### 검증 방법
```bash
# CTA 버튼 색상 확인
grep -r "Button\|CTA\|button" frontend/src --include="*.tsx" -A 5 | grep "background\|color"
```

#### 예상 발견 사항
- 일부 페이지에서 CTA 색상 불일치 가능성
- 대비 비율 미달 가능성

---

### 4. KickoffLabs 일관성

**원칙**: 색상, 텍스트 스타일, 버튼 스타일, 패딩, border-radius 일관성 유지.

#### 검증 항목
- [ ] **버튼 스타일**: 모든 버튼이 동일한 border-radius 사용
- [ ] **패딩 일관성**: 섹션 간 패딩 일관성
- [ ] **텍스트 스타일**: 제목, 본문, 라벨 스타일 일관성
- [ ] **간격 일관성**: 요소 간 간격 일관성

#### 검증 방법
```bash
# border-radius 사용 확인
grep -r "border-radius\|borderRadius" frontend/src --include="*.tsx" --include="*.ts"
grep -r "padding\|margin" frontend/src --include="*.tsx" --include="*.ts" | head -50
```

---

### 5. 4-Point Spacing 시스템

**원칙**: 모든 spacing 값이 4px의 배수여야 함 (4px, 8px, 12px, 16px, 20px, 24px, ...).

#### 검증 항목
- [ ] **테마 Spacing 사용**: `theme.spacing[n]` 사용
- [ ] **하드코딩 Spacing 제거**: `px` 직접 사용 금지
- [ ] **4px 배수 확인**: 모든 spacing 값이 4의 배수
- [ ] **일관된 Spacing 스케일**: spacing[0.5]=4px, spacing[1]=8px, spacing[2]=16px 등

#### 검증 방법
```bash
# 하드코딩된 spacing 검색
grep -r "[0-9]px" frontend/src --include="*.tsx" --include="*.ts" | grep -v "theme.spacing"
grep -r "spacing\[" frontend/src --include="*.tsx" --include="*.ts" | head -100

# 4px 배수가 아닌 값 검색 (예: 5px, 7px, 13px 등)
grep -r "[0-9]px" frontend/src --include="*.tsx" --include="*.ts" | grep -E "(5|7|9|11|13|15|17|19|21|23|25|27|29|31)px"
```

#### 예상 발견 사항
- 일부 컴포넌트에서 하드코딩된 spacing 사용
- 4px 배수가 아닌 spacing 값 사용
- 테마 spacing 미사용

---

## 📊 검증 우선순위

### Priority 1: Critical (즉시 수정 필요)
- [ ] 하드코딩된 색상 사용 (`#`, `rgb()`, `rgba()`)
- [ ] 하드코딩된 폰트 사용 (`font-family` 직접 지정)
- [ ] CTA 색상 불일치 (Primary 색상 미사용)
- [ ] 4px 배수가 아닌 spacing 값

### Priority 2: High (빠른 수정 권장)
- [ ] 테마 색상 미사용 (하드코딩은 아니지만 테마 미사용)
- [ ] 테마 폰트 미사용
- [ ] 테마 spacing 미사용
- [ ] 버튼 스타일 불일치

### Priority 3: Medium (점진적 개선)
- [ ] 패딩/마진 일관성 개선
- [ ] 텍스트 스타일 일관성 개선
- [ ] 대비 비율 최적화

---

## 🔧 검증 도구 및 스크립트

### 자동화 검증 스크립트

```typescript
// scripts/verify-design-compliance.ts
// 이 스크립트는 다음을 검증:
// 1. 하드코딩된 색상 (#, rgb, rgba)
// 2. 하드코딩된 폰트
// 3. 하드코딩된 spacing (px 값)
// 4. 테마 사용 여부
```

### 수동 검증 체크리스트

각 페이지별로 다음을 확인:

1. **색상 검증**
   - [ ] 모든 색상이 `theme.colors`에서 가져옴
   - [ ] Primary 색상은 CTA에만 사용
   - [ ] 하드코딩된 색상 없음

2. **폰트 검증**
   - [ ] 모든 텍스트가 `theme.typography.fontFamily.primary` 사용
   - [ ] 하드코딩된 폰트 없음
   - [ ] 폰트 크기는 `theme.typography.fontSize` 사용

3. **Spacing 검증**
   - [ ] 모든 spacing이 `theme.spacing[n]` 사용
   - [ ] 하드코딩된 `px` 값 없음
   - [ ] 모든 spacing 값이 4px 배수

4. **일관성 검증**
   - [ ] 버튼 스타일 일관성
   - [ ] 카드 스타일 일관성
   - [ ] 패딩/마진 일관성

---

## 📝 페이지별 상세 검증 계획

### HomePage 검증

**파일**: `frontend/src/pages/HomePage.tsx`, `frontend/src/pages/HomePage.styles.ts`

#### 검증 항목
- [ ] Hero 섹션: Primary 그라데이션 배경, Inter 폰트, 4-point spacing
- [ ] Featured Projects: Primary 색상 CTA, 테마 spacing
- [ ] Journey Milestone: Primary 색상 타임라인, Neutral 배경
- [ ] Testimonials: 테마 색상, 일관된 spacing

#### 예상 이슈
- Hero 섹션 하드코딩된 padding 값
- 일부 컴포넌트 테마 미사용

---

### AboutPage 검증

**파일**: `frontend/src/pages/AboutPage.tsx`, `frontend/src/pages/AboutPage.styles.ts`

#### 검증 항목
- [ ] Hero 섹션: Neutral 배경, Inter 폰트, 프로필 중심 레이아웃
- [ ] Background Section: 테마 색상, 4-point spacing
- [ ] Mission & Vision: Primary 색상 강조, 일관된 스타일
- [ ] Contact Section: Primary 그라데이션 배경, White 텍스트, Solid White CTA

#### 예상 이슈
- Contact Section의 새로운 스타일 검증 필요
- Mission & Vision 텍스트 스타일 일관성

---

### ProjectsPage 검증

**파일**: `frontend/src/pages/ProjectsPage.tsx`

#### 검증 항목
- [ ] FilterBar: Primary 색상 강조, CustomSelect 테마 준수
- [ ] ProjectCard: Primary 색상 CTA, 테마 spacing
- [ ] Tag 컴포넌트: 선택/비활성화 상태 색상 테마 준수
- [ ] Empty State: 테마 색상, 일관된 스타일

#### 예상 이슈
- FilterBar의 정적 그라데이션 라인 검증
- CustomSelect 컴포넌트 테마 준수 확인

---

### AcademicsPage 검증

**파일**: `frontend/src/pages/AcademicsPage.tsx`

#### 검증 항목
- [ ] StatCard: Primary 색상 강조 (GPA/WAM), 4-point spacing
- [ ] QuickNavBar: 테마 색상, 일관된 스타일
- [ ] AcademicCard: 테마 색상, expandable 스타일
- [ ] GradeBadge: Semantic 색상 (error, warning, success, primary)

#### 예상 이슈
- StatCard의 highlighted 스타일 검증
- QuickNavBar의 스크롤 가능한 레이아웃 검증

---

### ProjectDetailPage 검증

**파일**: `frontend/src/pages/ProjectDetailPage.tsx`

#### 검증 항목
- [ ] Hero 섹션: Primary 색상, Inter 폰트
- [ ] 섹션 스타일: 테마 색상, 4-point spacing
- [ ] CTA 버튼: Primary 색상 사용

---

### FeedbackPage 검증

**파일**: `frontend/src/pages/FeedbackPage.tsx`

#### 검증 항목
- [ ] 폼 스타일: 테마 색상, 일관된 spacing
- [ ] 버튼: Primary 색상 CTA
- [ ] 성공 메시지: Semantic 색상 (success)

---

### LoginPage 검증

**파일**: `frontend/src/pages/LoginPage.tsx`

#### 검증 항목
- [ ] 로그인 폼: 테마 색상, Inter 폰트
- [ ] 버튼: Primary 색상 CTA
- [ ] Google 로그인 버튼: 테마 준수

---

## 🛠️ 검증 실행 계획

### Phase 1: 자동화 검증 (1일)
1. 검증 스크립트 작성
2. 모든 파일 스캔
3. 이슈 리포트 생성

### Phase 2: 수동 검증 (2-3일)
1. 각 페이지별 상세 검토
2. 브라우저에서 시각적 확인
3. 컴포넌트별 스타일 검증

### Phase 3: 수정 및 재검증 (3-5일)
1. Priority 1 이슈 수정
2. Priority 2 이슈 수정
3. Priority 3 이슈 점진적 개선
4. 재검증 및 문서화

---

## 📈 검증 결과 문서화

### 결과 리포트 형식

```markdown
# 디자인 원칙 준수 검증 결과

## 종합 점수
- KickoffLabs 준수: X/10
- 4-Point Spacing 준수: X/10
- 전체 준수율: X%

## 페이지별 점수
| 페이지 | 색상 | 폰트 | CTA | Spacing | 일관성 | 총점 |
|--------|------|------|-----|---------|--------|------|
| HomePage | X/10 | X/10 | X/10 | X/10 | X/10 | X/50 |
| AboutPage | X/10 | X/10 | X/10 | X/10 | X/10 | X/50 |
| ... | ... | ... | ... | ... | ... | ... |

## 발견된 이슈
### Critical
- [이슈 1]
- [이슈 2]

### High Priority
- [이슈 1]
- [이슈 2]

### Medium Priority
- [이슈 1]
- [이슈 2]

## 수정 완료 사항
- [수정 1]
- [수정 2]
```

---

## 🔄 지속적 검증 프로세스

### 정기 검증
- **주간**: 새로 추가된 컴포넌트 검증
- **월간**: 전체 페이지 재검증
- **분기별**: 전체 시스템 재검증 및 문서 업데이트

### 자동화 체크
- **Pre-commit Hook**: 하드코딩된 색상/폰트/spacing 사용 시 경고
- **CI/CD Pipeline**: 디자인 원칙 준수 검증 단계 추가
- **Linter 규칙**: ESLint 규칙으로 디자인 원칙 강제

---

## 📚 참고 자료

### KickoffLabs 원칙
- [Landing Page Design: Optimizing Fonts and Colors for Conversions](https://kickofflabs.com/blog/landing-page-fonts-colors/)
- **핵심 원칙**:
  - 색상 팔레트 제한 (1-3개)
  - 폰트 제한 (1개, 최대 2개)
  - CTA 색상 역할 명확화
  - 일관성 유지

### 4-Point Spacing 시스템
- [Principles of Spacing in UI Design: A Beginner's Guide to the 4-Point Spacing System](https://uxplanet.org/principles-of-spacing-in-ui-design-a-beginners-guide-to-the-4-point-spacing-system-6e88233b527a)
- **핵심 원칙**:
  - 모든 spacing 값이 4px의 배수
  - 일관된 spacing 스케일 사용
  - 시각적 리듬 유지

### 프로젝트 내부 문서
- [KickoffLabs Compliance Audit](./KICKOFFLABS-COMPLIANCE-AUDIT.md)
- [Design Compatibility Analysis](./DESIGN-COMPATIBILITY-ANALYSIS.md)
- [Design Review: F+Z Pattern](./DESIGN-REVIEW-F-Z-PATTERN.md)

---

## ✅ 검증 완료 기준

### 최종 목표
- ✅ 모든 페이지가 KickoffLabs 원칙 100% 준수
- ✅ 모든 spacing 값이 4px 배수
- ✅ 하드코딩된 색상/폰트/spacing 0개
- ✅ 테마 시스템 100% 사용
- ✅ 일관성 점수 10/10

### 승인 기준
- KickoffLabs 준수율: 95% 이상
- 4-Point Spacing 준수율: 100%
- Critical 이슈: 0개
- High Priority 이슈: 5개 이하

---

**작성자**: Design System Team  
**검토자**: [검토자 이름]  
**승인자**: [승인자 이름]  
**다음 검증 예정일**: [날짜]

