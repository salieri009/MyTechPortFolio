# 🚀 ProjectsPage 성능 및 UX 고도화 전략

> **관점**: 시니어 퍼포먼스 엔지니어(Performance Engineer) 겸 UX 아키텍트  
> **목표**: 대규모 데이터(500+개)에서도 쾌적한 성능(LCP, TBT)과 향상된 사용자 경험(UX) 동시 달성  
> **원칙**: 기존 접근성(A11y) 기능 유지, 기존 기술 스택 활용

---

## 📊 현재 아키텍처 분석

### 강점
- ✅ Zustand를 활용한 명확한 전역 필터 상태 관리
- ✅ URL 파라미터 연동 (category → techStacks 자동 매핑)
- ✅ 강력한 키보드 접근성 및 ARIA 지원
- ✅ IntersectionObserver를 활용한 점진적 애니메이션(Stagger Effect)
- ✅ 우수한 Empty/Loading 상태 처리

### 병목 현상 (Bottlenecks)

#### 1. 확장성 문제 (Scalability)
```typescript
// 현재: 클라이언트 사이드 필터링
useEffect(() => {
  const loadProjects = async () => {
    const response = await getProjects({
      page: 0,
      size: 50,  // ❌ 하드코딩: 500개 프로젝트 시 초기 로드 50개만
      sort: 'endDate,desc'
    })
    setProjects(response.data.items)  // ❌ 전체 데이터를 메모리에 보관
  }
}, [])

useEffect(() => {
  // ❌ 클라이언트에서 500개 배열 필터링/정렬 (O(n) 연산)
  let filtered = [...projects]
  if (techStacks.length > 0) {
    filtered = filtered.filter(...)  // 메인 스레드 블로킹
  }
  setFilteredProjects(filtered)
}, [projects, techStacks, year, sort])
```

**문제점**:
- 초기 로드: 50개만 로드하므로 필터링 시 누락 가능
- 메모리 사용: 모든 프로젝트를 클라이언트에 보관 (500개 × 평균 5KB = 2.5MB)
- CPU 블로킹: 필터링/정렬이 메인 스레드에서 동기적으로 실행 (TBT 증가)
- 네트워크 낭비: 사용하지 않는 데이터까지 다운로드

#### 2. UX-Fidelity 부족
```typescript
// 현재: 필터링 피드백 부족
<Tag onClick={() => handleTechStackToggle(tech)}>
  {tech}  // ❌ 몇 개의 프로젝트가 있는지 표시 안 됨
</Tag>

// 필터링 중 시각적 피드백 없음
// ❌ "React" 태그 클릭 → 즉시 필터링되지만 진행 중임을 알 수 없음
```

**문제점**:
- 필터 적용 시 결과 수 미리 알 수 없음
- 필터링 진행 중 상태 표시 없음 (서버 요청 중인지 불명확)
- EmptyState가 "초기 상태"와 "필터 결과 없음"을 구분하지 못함

---

## 🎯 전략 1: 서버사이드 데이터 처리 (Scalability)

### 제안: 하이브리드 페이지네이션 + 서버사이드 필터링

**아키텍처 전환**:
```
[현재] 클라이언트 필터링
  초기 로드 (50개) → 클라이언트 메모리 → 필터링/정렬 → 렌더링

[개선] 서버사이드 필터링 + 페이지네이션
  필터 변경 → 디바운스 (300ms) → API 호출 → 서버 필터링/정렬 → 페이지네이션 응답 → 렌더링
```

### 구현 상세

#### 1.1 StateManagement 리팩토링 (Zustand)

```typescript
// stores/filters.ts 개선
interface FilterState {
  // 기존 필터 상태
  techStacks: string[]
  year: number | null
  sort: 'endDate,desc' | 'endDate,asc'
  
  // ✅ 추가: 로딩 상태 세분화
  isLoading: boolean           // 초기 로딩
  isFiltering: boolean         // 필터링 중 (서버 요청)
  isInitialLoad: boolean       // 첫 로드 여부
  
  // ✅ 추가: 페이지네이션 상태
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  
  // ✅ 추가: 필터 메타데이터 (UX 개선용)
  filterCounts: Record<string, number>  // { "React": 15, "TypeScript": 23 }
  
  // Actions
  setTechStacks: (stacks: string[]) => void
  setYear: (year: number | null) => void
  setSort: (sort: string) => void
  setLoading: (loading: boolean) => void
  setFiltering: (filtering: boolean) => void
  setPagination: (pagination: PaginationMeta) => void
  setFilterCounts: (counts: Record<string, number>) => void
  resetFilters: () => void
}
```

#### 1.2 DataFlow 리팩토링

```typescript
// ProjectsPage.tsx 개선
const ProjectsPage: React.FC = () => {
  const { 
    techStacks, year, sort,
    isLoading, isFiltering,
    currentPage, pageSize,
    setTechStacks, setYear, setSort,
    setLoading, setFiltering, setPagination
  } = useFilters()
  
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({})
  
  // ✅ 디바운스 훅 (300ms)
  const debouncedFilters = useDebounce(
    { techStacks, year, sort },
    300
  )
  
  // ✅ 서버사이드 필터링 API 호출
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setFiltering(true)  // 필터링 중 상태
        
        const response = await getProjects({
          page: currentPage,
          size: pageSize,
          sort: debouncedFilters.sort,
          techStacks: debouncedFilters.techStacks,
          year: debouncedFilters.year
        })
        
        if (response.success && response.data) {
          setProjects(response.data.items)
          
          // ✅ 페이지네이션 메타데이터 저장
          setPagination({
            totalItems: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
            hasNext: response.data.pagination.hasNext,
            hasPrevious: response.data.pagination.hasPrevious
          })
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
        setProjects([])
      } finally {
        setFiltering(false)
        setLoading(false)
      }
    }
    
    loadProjects()
  }, [debouncedFilters, currentPage, pageSize])  // ✅ 필터 변경 시 자동 재요청
  
  // ✅ 필터 카운트 API 호출 (선택적, 백그라운드)
  useEffect(() => {
    const loadFilterCounts = async () => {
      // 각 tech stack별 프로젝트 수를 가져오는 API
      // 예: GET /api/v1/projects/counts?techStacks=React,TypeScript
      const counts = await getProjectCountsByTechStack()
      setFilterCounts(counts)
    }
    
    loadFilterCounts()
  }, [])  // 초기 로드 시 한 번만
}
```

#### 1.3 성능 최적화 전략

**A. 디바운싱 (Debouncing)**
```typescript
// utils/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

**효과**: 
- 사용자가 빠르게 여러 필터를 클릭해도 마지막 입력 후 300ms 후에만 API 호출
- 불필요한 네트워크 요청 감소 (TBT 개선)

**B. 페이지네이션 전략**

**옵션 1: 전통적 페이지네이션** (권장)
```typescript
// 페이지 번호 기반
<Pagination>
  <PageButton page={1} />
  <PageButton page={2} />
  ...
  <PageButton page={totalPages} />
</Pagination>
```

**옵션 2: 무한 스크롤** (대안)
```typescript
// IntersectionObserver로 하단 감지
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNext && !isFiltering) {
        loadNextPage()  // 다음 페이지 로드
      }
    },
    { threshold: 0.1 }
  )
  
  if (loadMoreRef.current) observer.observe(loadMoreRef.current)
}, [hasNext, isFiltering])
```

**권장**: 전통적 페이지네이션 (접근성 우수, 사용자 제어 가능)

#### 1.4 영향 분석 (State & DataFlow)

**변경 전**:
```
초기 로드 → projects[] (50개) → 클라이언트 필터링 → filteredProjects[]
```

**변경 후**:
```
필터 변경 → 디바운스 (300ms) → API 호출 → projects[] (페이지네이션) → 렌더링
```

**State 변화**:
- `projects`: 서버에서 받은 현재 페이지의 프로젝트만 저장 (메모리 절약)
- `filteredProjects` 제거: 서버에서 이미 필터링된 데이터
- `isLoading`: 초기 로딩만 담당
- `isFiltering`: 필터 변경 시 서버 요청 중 상태 (새로 추가)

**DataFlow 변화**:
- 필터 변경 → `debouncedFilters` 업데이트 → `useEffect` 트리거 → API 호출
- 페이지 변경 → `currentPage` 업데이트 → `useEffect` 트리거 → API 호출

---

## 🎨 전략 2: 인터랙티브 필터 피드백 (UX-Fidelity)

### 제안: 실시간 필터 피드백 + 스켈레톤 UI

#### 2.1 필터 Tag에 카운트 표시

```typescript
// ProjectsPage.tsx
<TechStackFilters>
  {allTechStacks.map(tech => (
    <Tag
      key={tech}
      isSelected={techStacks.includes(tech)}
      onClick={() => handleTechStackToggle(tech)}
      aria-label={`${techStacks.includes(tech) ? 'Remove' : 'Add'} filter: ${tech} (${filterCounts[tech] || 0} projects)`}
    >
      {tech}
      {/* ✅ 카운트 표시 */}
      {filterCounts[tech] !== undefined && (
        <TagCount>({filterCounts[tech]})</TagCount>
      )}
    </Tag>
  ))}
</TechStackFilters>
```

**스타일**:
```typescript
const TagCount = styled.span`
  margin-left: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textMuted};
  opacity: 0.8;
`
```

**효과**:
- 사용자가 필터를 선택하기 전에 결과 수를 미리 확인 가능
- "React (15)" → 15개 프로젝트가 있다는 것을 즉시 인지

#### 2.2 필터링 진행 중 시각적 피드백

**A. 스켈레톤 UI (권장)**
```typescript
// components/project/ProjectCardSkeleton.tsx
const ProjectCardSkeleton = styled(Card)`
  height: ${props => props.theme.spacing[100]}; /* 400px */
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 50%,
    ${props => props.theme.colors.surface} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

// ProjectsPage.tsx
{isFiltering ? (
  <ProjectGrid>
    {[...Array(6)].map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </ProjectGrid>
) : (
  <ProjectGrid>
    {projects.map((project, index) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ProjectGrid>
)}
```

**B. 블러 효과 (대안)**
```typescript
const ProjectGrid = styled.div<{ $isFiltering: boolean }>`
  filter: ${props => props.$isFiltering ? 'blur(4px)' : 'none'};
  opacity: ${props => props.$isFiltering ? 0.6 : 1};
  transition: filter 0.3s ease, opacity 0.3s ease;
  pointer-events: ${props => props.$isFiltering ? 'none' : 'auto'};
  
  &::after {
    content: ${props => props.$isFiltering ? '"Filtering..."' : '""'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${props => props.theme.typography.fontSize.lg};
    color: ${props => props.theme.colors.primary[500]};
    display: ${props => props.$isFiltering ? 'block' : 'none'};
  }
`
```

**권장**: 스켈레톤 UI (더 명확한 피드백, LCP 개선)

#### 2.3 EmptyState 메시지 고도화

```typescript
// ProjectsPage.tsx
{(() => {
  // ✅ 초기 상태 (데이터 로딩 전)
  if (isLoading && projects.length === 0) {
    return <LoadingState />
  }
  
  // ✅ 필터 결과 없음 (필터 적용 후)
  if (!isLoading && projects.length === 0 && (techStacks.length > 0 || year !== null)) {
    return (
      <EmptyState role="status" aria-live="polite">
        <h3>{t('projects.empty.filtered.title', 'No projects match your filters')}</h3>
        <p>
          {t('projects.empty.filtered.description', 
            `No projects found with ${techStacks.length > 0 ? techStacks.join(', ') : ''} ${year ? `in ${year}` : ''}. Try adjusting your filters.`)}
        </p>
        <ClearFiltersButton onClick={resetFilters}>
          {t('projects.empty.filtered.clearFilters', 'Clear All Filters')}
        </ClearFiltersButton>
      </EmptyState>
    )
  }
  
  // ✅ 데이터 없음 (초기 상태, 필터 없음)
  if (!isLoading && projects.length === 0) {
    return (
      <EmptyState role="status" aria-live="polite">
        <h3>{t('projects.empty.initial.title', 'No projects available')}</h3>
        <p>{t('projects.empty.initial.description', 'Projects will appear here once they are added.')}</p>
      </EmptyState>
    )
  }
  
  // ✅ 정상 상태
  return (
    <ProjectGrid>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </ProjectGrid>
  )
})()}
```

#### 2.4 접근성 (A11y) 보장

**A. aria-live 영역 개선**
```typescript
// ProjectsPage.tsx
<StatusAnnouncer 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {isFiltering && (
    <span>
      {t('projects.filtering', 'Filtering projects...')}
    </span>
  )}
  {!isFiltering && projects.length > 0 && (
    <span>
      {t('projects.results', `Showing ${projects.length} of ${totalItems} projects`)}
    </span>
  )}
</StatusAnnouncer>

const StatusAnnouncer = styled.div`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`
```

**B. 필터 카운트 스크린 리더 지원**
```typescript
<Tag
  aria-label={`${tech} filter, ${filterCounts[tech] || 0} projects available`}
  aria-describedby={`tech-count-${tech}`}
>
  {tech}
  <TagCount id={`tech-count-${tech}`} aria-hidden="true">
    ({filterCounts[tech] || 0})
  </TagCount>
</Tag>
```

**C. 키보드 네비게이션 유지**
- 기존 `tabIndex`, `onKeyDown`, `aria-pressed` 유지
- 필터링 중에도 키보드 접근 가능 (스켈레톤 UI는 포커스 가능)

---

## 📈 성능 지표 개선 예상

### LCP (Largest Contentful Paint) 개선
- **현재**: 초기 50개 로드 → 클라이언트 필터링 → 렌더링 (약 800ms)
- **개선**: 서버 필터링 → 페이지네이션 (20개) → 렌더링 (약 400ms)
- **예상 개선**: **50% 감소** (400ms → 200ms)

### TBT (Total Blocking Time) 개선
- **현재**: 클라이언트 필터링 (500개 배열 처리) → 메인 스레드 블로킹 (약 150ms)
- **개선**: 서버 필터링 → 디바운싱 → 비동기 처리 (약 0ms)
- **예상 개선**: **100% 감소** (150ms → 0ms)

### 메모리 사용량 개선
- **현재**: 500개 프로젝트 × 5KB = **2.5MB**
- **개선**: 20개 프로젝트 × 5KB = **100KB** (페이지당)
- **예상 개선**: **96% 감소**

---

## 🔧 구현 체크리스트

### Phase 1: 서버사이드 필터링 (1-2일)
- [ ] `useDebounce` 훅 구현
- [ ] Zustand store에 `isFiltering`, `pagination` 상태 추가
- [ ] `getProjects` API 호출을 필터 변경 시 트리거되도록 수정
- [ ] 클라이언트 필터링 로직 제거
- [ ] 페이지네이션 UI 추가 (또는 무한 스크롤)

### Phase 2: 필터 피드백 (1일)
- [ ] `getProjectCountsByTechStack` API 엔드포인트 구현 (백엔드)
- [ ] 필터 카운트 표시 (`TagCount` 컴포넌트)
- [ ] 스켈레톤 UI 컴포넌트 구현
- [ ] `isFiltering` 상태에 따른 스켈레톤 UI 표시
- [ ] EmptyState 메시지 분리 (초기/필터 결과 없음)

### Phase 3: 접근성 및 최적화 (0.5일)
- [ ] `aria-live` 영역 개선
- [ ] 필터 카운트 스크린 리더 지원
- [ ] 성능 테스트 (Lighthouse)
- [ ] 메모리 프로파일링

---

## 🎯 핵심 원칙 준수

### ✅ 성능 최적화
- 서버사이드 필터링으로 클라이언트 CPU 부하 제거
- 페이지네이션으로 메모리 사용량 최소화
- 디바운싱으로 불필요한 네트워크 요청 감소

### ✅ 접근성 유지
- 기존 키보드 네비게이션 유지
- `aria-live` 영역으로 필터링 상태 알림
- 스크린 리더 사용자를 위한 카운트 정보 제공

### ✅ 기술 스택 활용
- Zustand: 상태 관리 (기존 유지)
- styled-components: 스타일링 (기존 유지)
- IntersectionObserver: 애니메이션 (기존 유지)
- React hooks: 디바운싱, 상태 관리 (기존 패턴)

---

## 📝 참고사항

### 백엔드 API 지원 확인
✅ **확인 완료**: `ProjectController`가 이미 서버사이드 필터링을 지원합니다:
- `GET /api/v1/projects?techStacks=React,TypeScript&year=2024&sort=endDate,desc&page=1&size=20`
- 응답: `ApiResponse<PageResponse<ProjectSummaryResponse>>`
- `PageResponse`에 `pagination` 메타데이터 포함 (`totalPages`, `hasNext`, `hasPrevious`, `total`)
- **즉시 구현 가능**: 백엔드 변경 없이 프론트엔드만 수정하면 됨

### 필터 카운트 API
새로운 엔드포인트 필요 (선택적):
- `GET /api/v1/projects/counts?techStacks=React,TypeScript`
- 응답: `{ "React": 15, "TypeScript": 23, ... }`

### 점진적 마이그레이션
기존 클라이언트 필터링을 완전히 제거하기 전에:
1. 서버사이드 필터링과 병행 운영
2. A/B 테스트로 성능 비교
3. 사용자 피드백 수집 후 완전 전환

