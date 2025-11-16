import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Container, Card, Tag } from '../components/common'
import { ProjectCard } from '../components/project/ProjectCard'
import { ProjectCardSkeleton } from '../components/project/ProjectCardSkeleton'
import { CustomSelect } from '../components/ui/CustomSelect'
import { useFilters } from '../stores/filters'
import { getProjects } from '../services/projects'
import { useDebounce } from '../utils/useDebounce'
import type { ProjectSummary } from '../types/domain'

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]});
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

// Category to tech stack mapping
const CATEGORY_TECH_MAP: Record<string, string[]> = {
  threejs: ['Three.js', 'WebGL', 'GLSL', 'Blender', 'React Three Fiber', 'GSAP', 'Cannon.js', 'Post-processing'],
  software: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Docker', 'Azure', 'REST API', 'GraphQL'],
  gamedev: ['Unity', 'C#', 'Unreal Engine', 'JavaScript', 'Phaser.js', 'WebRTC', 'Socket.io', 'Photon']
}

// Styled Components with proper theme properties
const FilterBar = styled(Card)<{ $isVisible: boolean }>`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  flex-wrap: wrap;
  align-items: center;
  padding: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s ease-out 0.1s forwards;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  
  /* 하단 그라데이션 라인 (정적, 더 세련됨) */
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
      transparent
    );
    opacity: 0.3;
  }
  
  /* 선택적: 미묘한 애니메이션 (원하는 경우) */
  /* 
  &::after {
    background-size: 200% 100%;
    animation: ${props => props.$isVisible ? 'subtleShimmer 4s ease-in-out infinite' : 'none'};
  }
  
  @keyframes subtleShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  */
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary[200]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    &::before {
      animation: none;
    }
  }

  .filter-label {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    margin-right: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  padding: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const PageTitle = styled.h1<{ $isVisible: boolean }>`
  font-size: ${props => props.theme.typography.fontSize['3xl']}; /* 4-point system: 2.5rem → 40px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  text-align: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s ease-out forwards;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`

const ProjectGrid = styled.div<{ $isVisible: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.theme.spacing[80]}, 1fr)); /* 4-point system: 320px */
  gap: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  margin-bottom: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? fadeIn : 'none'} 0.6s ease-out 0.2s forwards;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`

const AnimatedProjectCard = styled.div<{ $index: number; $isVisible: boolean }>`
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s ease-out forwards;
  animation-delay: ${props => props.$index * 0.05}s;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: none;
  }
`

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  flex-wrap: wrap;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  .filter-label {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.theme?.colors?.text || '#1F2937'};
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    margin-right: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]}; /* 4-point system: 8px 12px */
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.md};
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
    
    /* H3: User Control & Freedom - Focus state */
    &:focus {
      border-color: ${props => props.theme.colors.primary[500]};
      box-shadow: 0 0 0 ${props => props.theme.spacing[0.75]} ${props => props.theme.colors.primary[500]}20; /* 4-point system: 3px → 12px */
    }
  }
`

const TechStackFilters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  flex-wrap: wrap;
`

const SortFilters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  flex-wrap: wrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[15]} ${props => props.theme.spacing[5]}; /* 4-point system: 60px 20px → 60px 24px */
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px (1.5rem) */
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
    color: ${props => props.theme?.colors?.text || '#1F2937'};
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 16px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }
`

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(false)
  const [isGridVisible, setIsGridVisible] = useState(false)
  
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  
  const {
    techStacks,
    year,
    sort,
    isLoading,
    isFiltering,
    isInitialLoad,
    currentPage,
    pageSize,
    pagination,
    filterCounts,
    setTechStacks,
    setYear,
    setSort,
    setLoading,
    setFiltering,
    setInitialLoad,
    setPagination,
    setCurrentPage,
    setFilterCounts,
    resetFilters
  } = useFilters()
  
  // Debounce filters for server-side filtering
  const debouncedFilters = useDebounce(
    { techStacks, year, sort },
    300
  )

  // Handle category from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    if (category && CATEGORY_TECH_MAP[category]) {
      // Set tech stacks based on category
      setTechStacks(CATEGORY_TECH_MAP[category])
    }
  }, [searchParams, setTechStacks])

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === titleRef.current) setIsTitleVisible(true)
            if (entry.target === filterBarRef.current) setIsFilterBarVisible(true)
            if (entry.target === gridRef.current && !isFiltering) {
              // Only set grid visible if not filtering to prevent flickering
              setIsGridVisible(true)
            }
          }
        })
      },
      observerOptions
    )

    if (titleRef.current) observer.observe(titleRef.current)
    if (filterBarRef.current) observer.observe(filterBarRef.current)
    if (gridRef.current) observer.observe(gridRef.current)

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current)
      if (filterBarRef.current) observer.unobserve(filterBarRef.current)
      if (gridRef.current) observer.unobserve(gridRef.current)
    }
  }, [isFiltering])
  
  // Reset grid visibility when projects change (but not when filtering)
  useEffect(() => {
    if (!isFiltering && projects.length > 0) {
      setIsGridVisible(true)
    }
  }, [projects, isFiltering])

  // Server-side filtering with debounced filters
  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (isInitialLoad) {
          setLoading(true)
        } else {
          setFiltering(true)
        }
        
        const response = await getProjects({
          page: currentPage - 1, // Backend uses 0-based indexing
          size: pageSize,
          sort: debouncedFilters.sort,
          techStacks: debouncedFilters.techStacks,
          year: debouncedFilters.year
        })
        
        if (response.success && response.data) {
          setProjects(response.data.items)
          
          // Update pagination metadata
          if (response.data.pagination) {
            setPagination({
              totalItems: response.data.pagination.total || 0,
              totalPages: response.data.pagination.totalPages || 0,
              hasNext: response.data.pagination.hasNext || false,
              hasPrevious: response.data.pagination.hasPrevious || false
            })
          }
        } else {
          console.error('Failed to load projects:', response.error)
          setProjects([])
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
        setFiltering(false)
        setInitialLoad(false)
      }
    }

    loadProjects()
  }, [debouncedFilters, currentPage, pageSize, isInitialLoad, setLoading, setFiltering, setInitialLoad, setPagination])
  
  // Load filter counts (optional, for UX improvement) - only once on mount
  useEffect(() => {
    // Only load if filterCounts is empty to prevent unnecessary API calls
    if (Object.keys(filterCounts).length > 0) return
    
    const loadFilterCounts = async () => {
      try {
        // Get all projects to calculate counts
        const response = await getProjects({
          page: 0,
          size: 1000, // Get all for counting
          sort: 'endDate,desc'
        })
        
        if (response.success && response.data) {
          const allProjects = response.data.items
          const counts: Record<string, number> = {}
          
          // Count projects by tech stack
          allProjects.forEach(project => {
            project.techStacks.forEach(tech => {
              counts[tech] = (counts[tech] || 0) + 1
            })
          })
          
          setFilterCounts(counts)
        }
      } catch (error) {
        console.error('Failed to load filter counts:', error)
      }
    }
    
    loadFilterCounts()
  }, [filterCounts, setFilterCounts])

  // Get unique tech stacks for filter options (memoized to prevent flickering)
  // Use filterCounts if available, otherwise derive from current projects
  const allTechStacks = useMemo(() => {
    if (Object.keys(filterCounts).length > 0) {
      return Object.keys(filterCounts).sort()
    }
    // Fallback: derive from current projects if filterCounts not loaded yet
    const techSet = new Set<string>()
    projects.forEach(p => p.techStacks.forEach(tech => techSet.add(tech)))
    return Array.from(techSet).sort()
  }, [filterCounts, projects])
  
  // Get unique years for filter options (memoized to prevent flickering)
  const allYears = useMemo(() => {
    return [...new Set(projects.map(p => new Date(p.endDate).getFullYear()))].sort((a, b) => b - a)
  }, [projects])

  const handleTechStackToggle = (tech: string) => {
    if (techStacks.includes(tech)) {
      setTechStacks(techStacks.filter((t: string) => t !== tech))
    } else {
      setTechStacks([...techStacks, tech])
    }
  }

  // Don't show loading state if we're just filtering (use skeleton instead)
  if (isLoading && isInitialLoad) {
    return (
      <Container>
        <LoadingText>{t('projects.loading', 'Loading projects...')}</LoadingText>
      </Container>
    )
  }

  return (
    <Container>
      <PageTitle ref={titleRef} $isVisible={isTitleVisible} role="heading" aria-level={1}>
        {t('projects.title', 'My Projects')}
      </PageTitle>

      <FilterBar ref={filterBarRef} $isVisible={isFilterBarVisible} role="region" aria-label={t('projects.filters.title', 'Project filters')}>
        <FilterSection>
          <span className="filter-label">{t('projects.filters.techStack', 'Tech Stack:')}</span>
          <TechStackFilters role="group" aria-label={t('projects.filters.techStack', 'Tech Stack filters')}>
            {allTechStacks.map(tech => (
              <Tag
                key={tech}
                isSelected={techStacks.includes(tech)}
                onClick={() => handleTechStackToggle(tech)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-pressed={techStacks.includes(tech)}
                aria-label={`${techStacks.includes(tech) ? 'Remove' : 'Add'} filter: ${tech} (${filterCounts[tech] || 0} projects)`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleTechStackToggle(tech)
                  }
                }}
                count={filterCounts[tech]}
              >
                {tech}
                {filterCounts[tech] !== undefined && (
                  <span style={{ marginLeft: '4px', opacity: 0.8, fontSize: '0.875em' }}>
                    ({filterCounts[tech]})
                  </span>
                )}
              </Tag>
            ))}
          </TechStackFilters>
        </FilterSection>

        <FilterSection>
          <span className="filter-label">{t('projects.filters.year', 'Year:')}</span>
          <CustomSelect
            value={year?.toString() ?? 'all'}
            options={[
              { value: 'all', label: t('projects.filters.allYears', 'All Years') },
              ...allYears.map(y => ({ value: y.toString(), label: y.toString() }))
            ]}
            onChange={(value) => setYear(value === 'all' ? null : parseInt(value))}
            ariaLabel="Filter by year"
          />
        </FilterSection>

        <FilterSection>
          <span className="filter-label">{t('projects.filters.sort', 'Sort:')}</span>
          <SortFilters role="group" aria-label={t('projects.filters.sort', 'Sort options')}>
            {[
              { value: 'endDate,desc', label: t('projects.sort.newest', 'Newest First') },
              { value: 'endDate,asc', label: t('projects.sort.oldest', 'Oldest First') }
            ].map(option => (
              <Tag
                key={option.value}
                isSelected={sort === option.value}
                onClick={() => setSort(option.value as 'endDate,desc' | 'endDate,asc')}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-pressed={sort === option.value}
                aria-label={`Sort by ${option.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSort(option.value as 'endDate,desc' | 'endDate,asc')
                  }
                }}
              >
                {option.label}
              </Tag>
            ))}
          </SortFilters>
        </FilterSection>
      </FilterBar>

      {/* Status announcer for screen readers */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {isFiltering && (
          <span>{t('projects.filtering', 'Filtering projects...')}</span>
        )}
        {!isFiltering && projects.length > 0 && pagination && (
          <span>
            {t('projects.results', `Showing ${projects.length} of ${pagination.totalItems} projects`)}
          </span>
        )}
      </div>

      {/* Show skeleton UI while filtering */}
      {isFiltering ? (
        <ProjectGrid ref={gridRef} $isVisible={true} role="list" aria-label={t('projects.list', 'Projects list')}>
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={`skeleton-${i}`} />
          ))}
        </ProjectGrid>
      ) : projects.length === 0 ? (
        <EmptyState role="status" aria-live="polite">
          {isInitialLoad ? (
            <>
              <h3>{t('projects.empty.initial.title', 'No projects available')}</h3>
              <p>{t('projects.empty.initial.description', 'Projects will appear here once they are added.')}</p>
            </>
          ) : (techStacks.length > 0 || year !== null) ? (
            <>
              <h3>{t('projects.empty.filtered.title', 'No projects match your filters')}</h3>
              <p>
                {t('projects.empty.filtered.description', 
                  `No projects found with ${techStacks.length > 0 ? techStacks.join(', ') : ''} ${year ? `in ${year}` : ''}. Try adjusting your filters.`)}
              </p>
              <button
                onClick={resetFilters}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {t('projects.empty.filtered.clearFilters', 'Clear All Filters')}
              </button>
            </>
          ) : (
            <>
              <h3>{t('projects.empty.title', 'No projects found')}</h3>
              <p>{t('projects.empty.description', 'Try adjusting your filters to see more projects.')}</p>
            </>
          )}
        </EmptyState>
      ) : (
        <ProjectGrid ref={gridRef} $isVisible={isGridVisible} role="list" aria-label={t('projects.list', 'Projects list')}>
          {projects.map((project, index) => (
            <AnimatedProjectCard 
              key={project.id} 
              $index={index} 
              $isVisible={isGridVisible}
              role="listitem"
            >
              <ProjectCard 
                id={project.id}
                title={project.title}
                summary={project.summary}
                startDate={project.startDate}
                endDate={project.endDate}
                techStacks={project.techStacks}
                imageUrl={project.imageUrl}
              />
            </AnimatedProjectCard>
          ))}
        </ProjectGrid>
      )}
    </Container>
  )
}

export default ProjectsPage
export { ProjectsPage }
