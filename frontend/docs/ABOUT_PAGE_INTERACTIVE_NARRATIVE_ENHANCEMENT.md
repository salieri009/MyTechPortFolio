# 💡 AboutPage 인터랙티브 내러티브 고도화 제안

> **관점**: 시니어 인터랙션 디자이너(Interaction Designer) 겸 UX 전략가  
> **목표**: 정적인 콘텐츠를 사용자의 참여를 유도하는 '인터랙티브 내러티브'로 전환  
> **원칙**: KickoffLabs 디자인 시스템 준수, 4-Point Spacing, Nielsen Heuristics, A11y 유지, prefers-reduced-motion 존중

---

## 현재 상태 분석

### 강점
- HomePage와 완벽히 차별화된 Hero 섹션
- 명확한 섹션 분리 (SectionBridge)
- 높은 컴포넌트 재사용률 (93%)
- F-pattern을 활용한 우수한 가독성
- Nielsen Heuristics 및 A11y 원칙 준수
- 인터랙티브 타임라인 (SVG Path Animation)
- Tech Stack 모달 및 하이라이트 연동
- Mission & Vision 섹션 확장 기능

### 개선 기회 (해결됨)
- ✅ JourneyMilestoneSection: SVG Path Animation으로 스크롤 연동형 타임라인 구현
- ✅ BackgroundCard와 ValueCard: 인터랙티브 하이라이트 및 모달 기능 추가
- ✅ '스킬'과 '가치'의 연관성: TECH_VALUE_MAP을 통한 시각적 연결 구현
- ✅ Mission & Vision Section: ValueCard 확장 기능 및 텍스트 카드 스타일링 개선

---

## 핵심 제안

### 1. JourneyMilestoneSection: '경험하는 타임라인'으로 진화 (구현 완료)

#### 제안: SVG Path Animation을 활용한 스크롤 연동형 타임라인

**구현 방식**:
- 기존 `TimelineLineProgress`를 SVG `<path>`로 전환
- `IntersectionObserver`와 `getBoundingClientRect()`를 활용해 스크롤 진행도에 따라 `stroke-dasharray`와 `stroke-dashoffset` 애니메이션
- 각 마일스톤 노드가 화면에 진입할 때 SVG path가 해당 지점까지 그려짐

**UX Rationale**:
- **H1 (Visibility of System Status)**: 사용자가 스크롤할 때 타임라인이 "활성화"되는 것을 시각적으로 확인
- **Progressive Disclosure**: 한 번에 모든 정보를 보여주는 대신, 스크롤에 따라 점진적으로 타임라인이 그려지며 사용자의 주의를 자연스럽게 유도
- **Emotional Connection**: 정적 타임라인보다 "살아있는" 타임라인이 개인의 성장 여정을 더 생생하게 전달

**기술적 구현**:
```typescript
// SVG Path Animation Hook
const useTimelinePathAnimation = (containerRef: RefObject<HTMLElement>) => {
  const [pathLength, setPathLength] = useState(0)
  const [dashOffset, setDashOffset] = useState(0)
  
  useEffect(() => {
    const path = containerRef.current?.querySelector('path')
    if (!path) return
    
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    setPathLength(length)
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = calculateScrollProgress(entry)
          setDashOffset(length * (1 - progress))
        }
      })
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] })
    
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  return { pathLength, dashOffset }
}
```

**접근성 고려사항**:
- `prefers-reduced-motion`에서 SVG path 애니메이션 비활성화, 대신 즉시 완성된 path 표시
- `aria-live="polite"`로 현재 활성화된 마일스톤을 스크린 리더에 알림

---

### 2. '스킬'과 '가치'의 연결 (Background & Mission) (구현 완료)

#### 제안: 인터랙티브 카드 연결성 강화

**A. Tech Stack 카드 클릭 → 관련 프로젝트 모달**

**구현 방식**:
- `BackgroundCard` (Tech Stack) 클릭 시 관련 프로젝트를 필터링하여 모달 표시
- 모달은 `/projects` 페이지의 `ProjectCard` 컴포넌트 재사용
- 모달 닫기 버튼과 배경 클릭으로 닫기

**UX Rationale**:
- **H4 (Consistency & Standards)**: 기존 ProjectCard 컴포넌트 재사용으로 일관성 유지
- **H3 (User Control & Freedom)**: 모달 닫기, ESC 키, 배경 클릭 등 다양한 닫기 방법 제공
- **Evidence-Based Trust**: "React, TypeScript" 같은 기술 스택이 단순 나열이 아닌 실제 프로젝트로 증명됨

**기술적 구현**:
```typescript
// Tech Stack Modal Component
const TechStackModal = ({ techStack, onClose }: { techStack: string, onClose: () => void }) => {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  
  useEffect(() => {
    getProjects({ techStacks: techStack, page: 0, size: 6 })
      .then(res => setProjects(res.data.items))
  }, [techStack])
  
  return (
    <ModalOverlay onClick={onClose} role="dialog" aria-modal="true">
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Projects using {techStack}</h2>
          <CloseButton onClick={onClose} aria-label="Close modal">×</CloseButton>
        </ModalHeader>
        <ProjectGrid>
          {projects.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </ProjectGrid>
      </ModalContent>
    </ModalOverlay>
  )
}
```

**B. Tech Stack ↔ Mission Value 하이라이트 연동**

**구현 방식**:
- `BackgroundCard` (Tech Stack)에 특정 기술이 포함되어 있을 때, 관련 `ValueCard` (예: "React" → "Innovation")에 시각적 하이라이트
- Hover 시 연결선(connecting line) 또는 배경색 변화로 관계 표시
- 클릭 시 두 카드가 동시에 하이라이트되고, 짧은 설명 툴팁 표시

**UX Rationale**:
- **H4 (Recognition Rather Than Recall)**: 기술 스택과 가치의 관계를 시각적으로 명확히 제시
- **H1 (Visibility of System Status)**: Hover/Click 시 즉각적인 시각적 피드백
- **Narrative Coherence**: "React를 사용한다"는 기술적 사실이 "Innovation"이라는 가치와 어떻게 연결되는지 직관적으로 이해 가능

**기술적 구현**:
```typescript
// Tech Stack to Value Mapping
const TECH_VALUE_MAP: Record<string, string[]> = {
  'React': ['innovation'],
  'TypeScript': ['innovation', 'growth'],
  'Spring Boot': ['collaboration'],
  'Node.js': ['innovation', 'collaboration'],
  // ...
}

// Highlight Connection Hook
const useTechValueConnection = () => {
  const [highlightedTech, setHighlightedTech] = useState<string | null>(null)
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)
  
  const handleTechHover = (tech: string) => {
    setHighlightedTech(tech)
    const relatedValues = TECH_VALUE_MAP[tech] || []
    // 관련 ValueCard에 하이라이트 클래스 추가
  }
  
  return { highlightedTech, highlightedValue, handleTechHover }
}
```

**시각적 디자인**:
- 하이라이트: Primary[50] 배경, Primary[500] 테두리, Primary[200] 그림자
- ValueCard 확장: 클릭 시 상세 설명 표시, fadeIn 애니메이션
- ValueIcon: 원형 배경 (Primary[50]), Primary[500] 텍스트, 64px 크기

**C. Mission & Vision Section Enhancement**

**구현 방식**:
- ValueCard 클릭 시 확장 가능한 상세 설명 표시
- Mission/Vision 텍스트를 카드 형태로 재디자인 (라벨 포함)
- 스크롤 트리거 애니메이션으로 점진적 등장
- ValueIcon을 원형 배경이 있는 아이콘으로 개선

**UX Rationale**:
- **H3 (User Control & Freedom)**: 사용자가 원하는 가치에 대해 더 자세한 정보를 선택적으로 탐색 가능
- **H1 (Visibility of System Status)**: 확장/축소 상태가 명확히 표시됨 (`aria-expanded`)
- **Progressive Disclosure**: 기본 설명만 보여주고, 관심 있는 가치에 대해 더 깊이 있는 정보 제공
- **Narrative Depth**: 단순 나열이 아닌, 각 가치에 대한 구체적인 설명으로 신뢰도 향상

**기술적 구현**:
```typescript
// ValueCard 확장 기능
const [expandedValue, setExpandedValue] = useState<string | null>(null)

// ValueCard 클릭/키보드 이벤트
onClick={() => setExpandedValue(expandedValue === 'innovation' ? null : 'innovation')}
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    setExpandedValue(expandedValue === 'innovation' ? null : 'innovation')
  }
}}

// 확장된 콘텐츠
{expandedValue === 'innovation' && (
  <ValueExpandedContent>
    {t('about.mission.values.innovation.detail', '...')}
  </ValueExpandedContent>
)}
```

**Mission/Vision 텍스트 개선**:
- 카드 형태로 재디자인 (배경, 테두리, 패딩)
- "MISSION" / "VISION" 라벨 추가 (Primary 색상, 대문자)
- 호버 효과 추가 (테두리 색상 변화, 그림자)
- 스크롤 트리거 fadeInUp 애니메이션

---

### 3. Mission & Vision Section Enhancement (구현 완료)

#### 제안: 확장 가능한 ValueCard 및 개선된 텍스트 프레젠테이션

**구현 방식**:
- ValueCard 클릭 시 확장 가능한 상세 설명 표시
- Mission/Vision 텍스트를 카드 형태로 재디자인
- ValueIcon을 원형 배경이 있는 아이콘으로 개선
- 스크롤 트리거 애니메이션으로 점진적 등장

**UX Rationale**:
- **H3 (User Control & Freedom)**: 사용자가 원하는 가치에 대해 더 자세한 정보를 선택적으로 탐색 가능
- **H1 (Visibility of System Status)**: 확장/축소 상태가 명확히 표시됨 (`aria-expanded`)
- **Progressive Disclosure**: 기본 설명만 보여주고, 관심 있는 가치에 대해 더 깊이 있는 정보 제공
- **Narrative Depth**: 단순 나열이 아닌, 각 가치에 대한 구체적인 설명으로 신뢰도 향상

**기술적 구현**:
```typescript
// ValueCard 확장 상태 관리
const [expandedValue, setExpandedValue] = useState<string | null>(null)

// 클릭/키보드 이벤트
onClick={() => setExpandedValue(expandedValue === 'innovation' ? null : 'innovation')}
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    setExpandedValue(expandedValue === 'innovation' ? null : 'innovation')
  }
}}

// 확장된 콘텐츠 (fadeIn 애니메이션)
{expandedValue === 'innovation' && (
  <ValueExpandedContent>
    {t('about.mission.values.innovation.detail', '...')}
  </ValueExpandedContent>
)}
```

**Mission/Vision 텍스트 개선**:
- 카드 형태로 재디자인 (배경, 테두리, 패딩)
- "MISSION" / "VISION" 라벨 추가 (Primary 색상, 대문자)
- 호버 효과 추가 (테두리 색상 변화, 그림자)
- 스크롤 트리거 fadeInUp 애니메이션

---

## 접근성 고려사항 (A11y)

### prefers-reduced-motion 지원

**SVG Path Animation**:
```css
@media (prefers-reduced-motion: reduce) {
  path {
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
    animation: none !important;
  }
}
```

**카드 하이라이트**:
- 애니메이션 대신 즉각적인 색상 변화
- 연결선 애니메이션 제거, 정적 선으로 표시

### 키보드 네비게이션

- Tech Stack 카드: `tabIndex={0}`, `Enter`/`Space`로 모달 열기
- 모달: `Escape`로 닫기, `Tab`으로 모달 내부 요소 순환, `Shift+Tab`으로 역순
- ValueCard: `tabIndex={0}`, `Enter`/`Space`로 확장/축소, `aria-expanded`로 상태 표시

### 스크린 리더 지원

- 모달: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`로 제목 연결
- 하이라이트 상태: `$isHighlighted` prop으로 시각적 피드백 제공
- 타임라인 진행도: `aria-live="polite"`로 현재 활성 마일스톤 알림
- ValueCard 확장: `aria-expanded`로 확장/축소 상태 명시

---

## 디자인 원칙 준수

### KickoffLabs
- Primary + Neutral 색상만 사용
- Inter 폰트 유지
- 일관된 border-radius (`radius.lg`, `radius.md`)

### 4-Point Spacing
- 모든 spacing 값이 4px의 배수
- 모달 패딩: `spacing[6]` (24px)
- ValueIcon 크기: `spacing[16]` (64px)
- MissionText 패딩: `spacing[6]` (24px)

### Nielsen Heuristics
- **H1 (Visibility of System Status)**: 스크롤 진행도, 하이라이트 상태, 확장 상태 명확히 표시
- **H3 (User Control & Freedom)**: 모달 닫기, 키보드 네비게이션, ValueCard 확장/축소
- **H4 (Consistency & Standards)**: 기존 컴포넌트 재사용, 일관된 인터랙션 패턴

---

## 🚀 구현 우선순위

### Phase 1: SVG Path Animation (완료)
- [x] SVG path로 타임라인 라인 전환
- [x] `useTimelinePathAnimation` hook 구현
- [x] 스크롤 진행도 계산 로직
- [x] `prefers-reduced-motion` 지원

### Phase 2: Tech Stack Modal (완료)
- [x] `TechStackModal` 컴포넌트 구현
- [x] 모달 오버레이 및 닫기 로직
- [x] ProjectCard 재사용
- [x] 키보드 네비게이션 및 ARIA 속성

### Phase 3: Tech-Value Connection (완료)
- [x] `TECH_VALUE_MAP` 정의
- [x] Tech-Value 하이라이트 연동 구현
- [x] ValueCard 하이라이트 상태 스타일링
- [x] BackgroundCard 클릭 시 모달 열기

### Phase 4: Mission & Vision Section Enhancement (완료)
- [x] ValueCard 확장 가능한 콘텐츠 추가
- [x] 클릭/키보드로 ValueCard 확장/축소
- [x] Mission/Vision 텍스트 카드 스타일링
- [x] Mission/Vision 라벨 추가
- [x] 스크롤 트리거 애니메이션
- [x] ValueIcon 스타일 개선 (원형 배경)

---

## 구현 완료 사항

### Phase 1: SVG Path Animation
- SVG path로 타임라인 라인 전환 완료
- `useTimelinePathAnimation` hook 구현 완료
- 스크롤 진행도 계산 로직 구현 완료
- `prefers-reduced-motion` 지원 완료

### Phase 2: Tech Stack Modal
- `TechStackModal` 컴포넌트 구현 완료
- 모달 오버레이 및 닫기 로직 구현 완료
- ProjectCard 재사용 완료
- 키보드 네비게이션 및 ARIA 속성 구현 완료

### Phase 3: Tech-Value Connection
- `TECH_VALUE_MAP` 정의 완료
- Tech-Value 하이라이트 연동 구현 완료
- ValueCard 하이라이트 상태 스타일링 완료
- BackgroundCard 클릭 시 모달 열기 구현 완료

### Phase 4: Mission & Vision Section Enhancement
- ValueCard 확장 가능한 콘텐츠 추가 완료
- 클릭/키보드로 ValueCard 확장/축소 구현 완료
- Mission/Vision 텍스트 카드 스타일링 완료
- Mission/Vision 라벨 추가 완료
- 스크롤 트리거 애니메이션 구현 완료
- ValueIcon 스타일 개선 (원형 배경) 완료

## 참고사항

- 모든 인터랙션은 기존 디자인 시스템을 존중하며 구현됨
- 성능 최적화: `will-change`, `transform` 사용, 불필요한 리렌더링 방지
- 모바일 반응형: 터치 제스처 지원, 모달 전체 화면 표시
- 접근성: 모든 인터랙티브 요소에 키보드 네비게이션 및 ARIA 속성 적용

