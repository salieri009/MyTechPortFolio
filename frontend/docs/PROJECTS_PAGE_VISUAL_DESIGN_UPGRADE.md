# 🎨 ProjectsPage 시각 디자인 고도화 제안

> **관점**: 시니어 비주얼 디자이너(Visual Designer) 및 UI 아티스트  
> **목표**: 기능적으로 완벽한 페이지를 '매력적이고 아름다운 인터랙티브 쇼케이스'로 업그레이드  
> **원칙**: KickoffLabs 디자인 시스템 준수, 4-Point Spacing, A11y 유지, prefers-reduced-motion 존중

---

## 📊 현재 상태 분석

### 강점
- ✅ 기능적으로 완벽: 필터링, 정렬, 상태 관리, A11y 모두 우수
- ✅ KickoffLabs 원칙 준수: Primary + Neutral 색상, 일관된 스타일
- ✅ 4-Point Spacing 시스템 적용

### 개선 기회
- ⚠️ ProjectCard: 정보 나열식, 클릭 유도가 약함
- ⚠️ FilterBar: 네이티브 `<select>` 사용으로 디자인 일관성 저하
- ⚠️ Tag 상태: 선택됨/선택 가능/비활성화 구분이 명확하지 않음
- ⚠️ 시각적 즐거움: 마이크로 인터랙션이 부족

---

## 🎯 핵심: ProjectCard 디자인 업그레이드

### 제안 1: 이미지 통합 및 Hover 이펙트

#### 레이아웃 제안: 카드 상단 이미지 + 오버레이

```typescript
// 레이아웃 구조
<ProjectCardWrapper>
  <ImageContainer>  {/* 상단: 이미지 영역 */}
    <ProjectImage />
    <ImageOverlay />  {/* Hover 시 나타나는 오버레이 */}
    <ViewButton />    {/* "View Project →" 버튼 */}
  </ImageContainer>
  <ProjectContent>  {/* 하단: 텍스트 콘텐츠 */}
    <ProjectTitle />
    <ProjectSummary />
    <ProjectMeta />
    <TechStacks />
  </ProjectContent>
</ProjectCardWrapper>
```

#### Hover 마이크로 인터랙션 상세

**A. 이미지 줌인 효과**
```css
ProjectImage {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

ProjectCardWrapper:hover ProjectImage {
  transform: scale(1.08);  /* 미묘한 줌인 (8%) */
}
```

**B. Primary 색상 오버레이**
```css
ImageOverlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.85) 0%,  /* primary[500] with opacity */
    rgba(37, 99, 235, 0.9) 100%   /* primary[600] with opacity */
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

ProjectCardWrapper:hover ImageOverlay {
  opacity: 1;
}
```

**C. "View Project →" 버튼 등장**
```css
ViewButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateY(${spacing[4]});
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

ProjectCardWrapper:hover ViewButton {
  opacity: 1;
  transform: translate(-50%, -50%) translateY(0);
}
```

**스타일**:
- 배경: `primary[500]` 또는 `hero.text` (오버레이 위에서 보이도록)
- 텍스트: 흰색 또는 `hero.text`
- 아이콘: `→` 또는 `↗` (외부 링크 느낌)
- 패딩: `spacing[3] spacing[6]` (12px 24px)
- border-radius: `radius.lg` (16px)

#### 이미지 없을 때 Fallback

```typescript
<ImagePlaceholder>
  {/* 그라데이션 배경 또는 아이콘 */}
  <PlaceholderIcon>💻</PlaceholderIcon>
  {/* 또는 Primary 색상 그라데이션 */}
  background: linear-gradient(135deg, primary[500], primary[600]);
</ImagePlaceholder>
```

### 제안 2: Tech Stack 태그(+N) 스타일

#### +N 태그 디자인

```typescript
const MoreTag = styled(Tag)`
  /* 기본 스타일: Outline */
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary[300]};
  color: ${props => props.theme.colors.primary[600]};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  
  /* Hover: Primary 배경 */
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[700]};
  }
  
  /* 아이콘 추가 (선택적) */
  &::before {
    content: '+';
    margin-right: ${props => props.theme.spacing[0.5]};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }
`
```

**시각적 계층**:
- 일반 태그: `surface` 배경, `border` 테두리
- +N 태그: `primary[300]` 테두리, `primary[600]` 텍스트 (더 눈에 띄게)

---

## 🎨 FilterBar: 세련된 컨트롤 UI

### 제안 1: 커스텀 드롭다운(Select) 디자인

#### 디자인 시스템에 맞는 커스텀 Select

```typescript
const CustomSelect = styled.div<{ $isOpen: boolean }>`
  position: relative;
  min-width: ${props => props.theme.spacing[40]}; /* 160px */
`

const SelectTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Hover */
  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background: ${props => props.theme.colors.primary[50]};
  }
  
  /* Focus */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* Open state */
  ${props => props.$isOpen && `
    border-color: ${props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props.theme.spacing[0.75]} ${props.theme.colors.primary[500]}20;
  `}
`

const SelectIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: ${props => props.theme.colors.textSecondary};
  
  /* 화살표 아이콘: ▼ */
  &::after {
    content: '▼';
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`

const SelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${props => props.theme.spacing[1]});
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : `translateY(-${props.theme.spacing[2]})`};
  transition: all 0.2s ease;
  max-height: ${props => props.theme.spacing[100]}; /* 400px */
  overflow-y: auto;
`

const SelectOption = styled.button<{ $isSelected: boolean }>`
  display: block;
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  text-align: left;
  border: none;
  background: ${props => props.$isSelected ? props.theme.colors.primary[50] : 'transparent'};
  color: ${props => props.$isSelected ? props.theme.colors.primary[700] : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: background 0.15s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[50]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: -2px;
  }
  
  /* Selected indicator */
  ${props => props.$isSelected && `
    &::before {
      content: '✓';
      margin-right: ${props.theme.spacing[2]};
      color: ${props.theme.colors.primary[600]};
      font-weight: ${props.theme.typography.fontWeight.bold};
    }
  `}
`
```

**접근성 보장**:
- `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`
- 키보드 네비게이션: Arrow keys, Enter, Escape
- `aria-activedescendant`로 현재 포커스 옵션 표시

### 제안 2: Tag 상태 별 시각적 피드백 강화

#### 3가지 상태: Selected / Available / Disabled

```typescript
const FilterTag = styled(Tag).withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isDisabled', 'count'].includes(prop)
})<{ 
  isSelected?: boolean
  isDisabled?: boolean
  count?: number
}>`
  /* 기본: Available (선택 가능) */
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  /* Selected: Primary 배경 */
  ${props => props.isSelected && `
    background: ${props.theme.colors.primary[500]};
    border-color: ${props.theme.colors.primary[500]};
    color: ${props.theme.colors.hero?.text || '#ffffff'};
    font-weight: ${props.theme.typography.fontWeight.semibold};
    box-shadow: 0 0 0 ${props.theme.spacing[0.5]} ${props.theme.colors.primary[200]};
  `}
  
  /* Disabled: 반투명 (결과 0개) */
  ${props => props.isDisabled && `
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  /* Hover: Available 상태에서만 */
  ${props => !props.isSelected && !props.isDisabled && `
    &:hover {
      border-color: ${props.theme.colors.primary[300]};
      background: ${props.theme.colors.primary[50]};
      color: ${props.theme.colors.primary[700]};
      transform: translateY(-${props.theme.spacing[0.5]});
    }
  `}
  
  /* 카운트 표시 */
  ${props => props.count !== undefined && `
    &::after {
      content: ' (${props.count})';
      font-size: ${props.theme.typography.fontSize.xs};
      opacity: 0.7;
      margin-left: ${props.theme.spacing[1]};
    }
  `}
`
```

**시각적 계층**:
1. **Selected**: Primary 배경 + 흰색 텍스트 + 그림자 (가장 눈에 띔)
2. **Available**: Outline 스타일 + Hover 시 Primary 배경 (중간)
3. **Disabled**: 반투명 + pointer-events: none (가장 약함)

### 제안 3: FilterBar Shimmer 애니메이션 개선

#### 대안: 미묘한 Border-Bottom 그라데이션

```typescript
const FilterBar = styled(Card)`
  /* 기존 shimmer 제거 또는 선택적 사용 */
  
  /* 대안: 하단 그라데이션 라인 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${props => props.theme.spacing[0.5]}; /* 4px */
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      ${props => props.theme.colors.primary[400]},
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    background-size: 200% 100%;
    opacity: 0.6;
    animation: ${props => props.$isVisible ? 'subtleShimmer 4s ease-in-out infinite' : 'none'};
  }
  
  @keyframes subtleShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* 또는 정적 그라데이션 (더 미묘함) */
  /* 
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
  */
`
```

**권장**: 정적 그라데이션 (더 미묘하고 세련됨, 성능 우수)

---

## 🎯 구현 우선순위

### Phase 1: ProjectCard Hover 이펙트 (즉시 구현)
- [ ] ImageOverlay 컴포넌트 추가
- [ ] ViewButton 컴포넌트 추가
- [ ] 이미지 줌인 애니메이션
- [ ] +N 태그 스타일 개선

### Phase 2: FilterBar UI 세련화 (1-2일)
- [ ] 커스텀 Select 컴포넌트 구현
- [ ] Tag 상태별 스타일 (Selected/Available/Disabled)
- [ ] FilterBar shimmer 개선 (정적 그라데이션)

### Phase 3: 마이크로 인터랙션 정제 (0.5일)
- [ ] 애니메이션 타이밍 조정
- [ ] prefers-reduced-motion 테스트
- [ ] 접근성 검증

---

## 📐 디자인 원칙 준수

### ✅ KickoffLabs
- Primary + Neutral 색상만 사용
- Inter 폰트 유지
- 일관된 border-radius (`radius.lg`, `radius.md`)

### ✅ 4-Point Spacing
- 모든 spacing 값이 4px의 배수
- `spacing[0.5]` (4px), `spacing[1]` (8px), `spacing[2]` (16px) 등

### ✅ 접근성 (A11y)
- 키보드 네비게이션 유지
- `aria-*` 속성 보존
- 포커스 상태 명확히 표시

### ✅ 성능
- `will-change` 최소 사용
- GPU 가속 (`translateZ(0)`)
- `prefers-reduced-motion` 존중

