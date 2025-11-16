<!-- 1827bfae-2ee1-4d62-aa3e-f8c8ac5e5148 92f61234-9458-49ee-b5d8-417bd69b67e5 -->
# 색상 일관성 개선 및 이모티콘 제거 계획

## 문제점 분석

1. **이모티콘 사용 위치:**

- `HomePage.tsx`: `SectionTitle`에 `🌟` (Featured Projects), `💬` (Testimonials)
- `SectionPurpose` 컴포넌트: `icon` prop으로 `💡`, `💬`, `📈` 사용
- `SectionBridge` 컴포넌트: `icon="→"` 사용
- `JourneyMilestoneSection.tsx`: `SectionPurpose`에 `📈` 사용

2. **색상 일관성 문제:**

- 하드코딩된 색상 값이 일부 컴포넌트에 존재할 가능성
- 테마 색상 시스템을 일관되게 사용하지 않는 부분 확인 필요

## 구현 계획

### Phase 1: 이모티콘 제거

#### 1.1 HomePage.tsx 수정

- `SectionTitle`에서 `🌟`, `💬` 이모티콘 제거
- `SectionPurpose`의 `icon` prop 제거 (또는 빈 문자열로 변경)
- `SectionBridge`의 `icon="→"` prop 제거

**파일:** `frontend/src/pages/HomePage.tsx`

- Line 501: `🌟 {t('featured.title')}` → `{t('featured.title')}`
- Line 504: `icon="💡"` → `icon=""` 또는 prop 제거
- Line 574: `💬 {t('testimonials.title')}` → `{t('testimonials.title')}`
- Line 577: `icon="💬"` → `icon=""` 또는 prop 제거
- Line 486, 496, 561, 569: `icon="→"` → `icon=""` 또는 prop 제거

#### 1.2 JourneyMilestoneSection.tsx 수정

- `SectionPurpose`의 `icon="📈"` 제거

**파일:** `frontend/src/components/sections/JourneyMilestoneSection.tsx`

- Line 572: `icon="📈"` → `icon=""` 또는 prop 제거

#### 1.3 SectionPurpose 컴포넌트 개선

- `icon` prop을 선택적으로 만들고, 이모티콘 대신 텍스트나 아이콘으로 대체할 수 있도록 개선
- 또는 `icon` prop을 완전히 제거하고 텍스트만 사용

**파일:** `frontend/src/components/sections/SectionPurpose.tsx`

- `PurposeIcon` 스타일 컴포넌트 제거 또는 조건부 렌더링 개선

#### 1.4 SectionBridge 컴포넌트 개선

- `icon` prop 제거 또는 텍스트 기반 화살표로 대체

**파일:** `frontend/src/components/sections/SectionBridge.tsx`

- `BridgeIcon` 스타일 컴포넌트 제거 또는 조건부 렌더링 개선

### Phase 2: 색상 일관성 개선

#### 2.1 하드코딩된 색상 값 검색 및 교체

다음 파일들에서 하드코딩된 색상 값을 찾아 테마 색상으로 교체:

- `frontend/src/components/project/FeaturedProjectCard.tsx`
- `frontend/src/components/project/HeroProjectCard.tsx`
- `frontend/src/components/recruiter/CareerSummaryDashboard.tsx`
- `frontend/src/components/recruiter/PersonalInfoHeader.tsx`
- `frontend/src/components/project/ProjectCard.tsx`
- `frontend/src/components/testimonials/TestimonialCard.tsx`
- `frontend/src/components/GoogleLoginButton.tsx`

**검색 패턴:** `#[0-9A-Fa-f]{3,6}`, `rgb(`, `rgba(`

**교체 원칙:**

- 모든 색상은 `theme.colors`에서 가져와야 함
- Primary 색상: `theme.colors.primary[500]`
- Secondary 색상: `theme.colors.secondary[500]`
- Neutral 색상: `theme.colors.neutral[XXX]`
- Text 색상: `theme.colors.text`, `theme.colors.textSecondary`, `theme.colors.textMuted`
- Background: `theme.colors.background`, `theme.colors.surface`
- Border: `theme.colors.border`

#### 2.2 테마 색상 사용 검증

모든 styled-components에서 `props.theme.colors`를 통해 색상을 참조하는지 확인

### Phase 3: 디자인 개선

#### 3.1 SectionPurpose 디자인 개선

- 이모티콘 제거 후, 필요시 텍스트 스타일로 강조 (예: `::before` 가상 요소로 작은 점 또는 선 추가)
- 또는 완전히 제거하고 텍스트만 사용

#### 3.2 SectionBridge 디자인 개선

- 화살표 이모티콘 대신 CSS로 만든 화살표 또는 완전히 제거
- 시각적 구분은 `::before` 수직선만으로 충분

#### 3.3 전체적인 시각적 일관성

- 모든 섹션 제목에서 이모티콘 제거
- 색상 팔레트를 테마에 맞춰 통일
- 미래지향적/기계적 톤 유지 (이모티콘 없이도 깔끔한 디자인)

### Phase 4: i18n 텍스트 확인

#### 4.1 i18n 파일에서 이모티콘 확인

- `frontend/src/i18n/locales/ko.json`
- `frontend/src/i18n/locales/en.json`
- `frontend/src/i18n/locales/ja.json`

**확인 항목:**

- `storytelling.journeyPurpose`에 이모티콘 포함 여부
- `storytelling.projectsPurpose`에 이모티콘 포함 여부
- `storytelling.testimonialsPurpose`에 이모티콘 포함 여부
- 기타 이모티콘이 포함된 텍스트

#### 4.2 이모티콘 제거 또는 자연스러운 텍스트로 교체

- 이모티콘이 포함된 경우 제거하고 자연스러운 문구로 수정

## 구현 순서

1. **이모티콘 제거** (Phase 1)

- HomePage.tsx에서 모든 이모티콘 제거
- JourneyMilestoneSection.tsx에서 이모티콘 제거
- SectionPurpose, SectionBridge 컴포넌트에서 icon prop 처리

2. **색상 일관성 개선** (Phase 2)

- 하드코딩된 색상 값 검색
- 테마 색상으로 교체

3. **디자인 개선** (Phase 3)

- 이모티콘 제거 후 시각적 대체 요소 추가 (필요시)
- 전체적인 일관성 확보

4. **i18n 텍스트 정리** (Phase 4)

- i18n 파일에서 이모티콘 확인 및 제거

## 예상 결과

- 모든 이모티콘이 제거되고 깔끔한 텍스트 기반 디자인
- 테마 색상 시스템을 일관되게 사용하여 색상 통일성 확보
- 미래지향적/기계적 톤 유지하면서도 더욱 전문적인 느낌

### To-dos

- [ ] SectionBridge 컴포넌트 생성 - 섹션 간 연결 문구를 표시하는 브릿지 컴포넌트
- [ ] SectionPurpose 컴포넌트 생성 - 각 섹션의 목적을 설명하는 작은 텍스트 컴포넌트
- [ ] StoryProgressBar 컴포넌트 생성 - 페이지 상단에 고정된 스토리 진행도 바
- [ ] i18n 텍스트 추가 - ko.json, en.json, ja.json에 스토리텔링 관련 텍스트 추가
- [ ] HomePage 섹션 순서 재구성 - Journey를 Featured Projects 앞으로 이동
- [ ] HomePage에 Bridge 추가 - 각 섹션 간에 SectionBridge 컴포넌트 배치
- [ ] HomePage에 StoryProgressBar 통합 - 페이지 상단에 진행도 바 추가
- [ ] 각 섹션에 SectionPurpose 추가 - 섹션 제목 아래에 목적 설명 추가
- [ ] 시각적 전환 효과 추가 - 각 섹션에 상단 구분선 및 배경색 전환 적용
- [ ] 애니메이션 통합 - Bridge와 섹션 전환 애니메이션 적용