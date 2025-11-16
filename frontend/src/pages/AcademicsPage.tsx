import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components'
import { Container, Card } from '@components/common'
import { getAcademics } from '@services/academics'
import type { Academic } from '@model/domain'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]}); /* 4-point system: 32px */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const PageWrapper = styled.div`
  padding: ${props => props.theme.spacing[20]} 0;
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[16]} 0;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`

const TimelineContainer = styled.div`
  max-width: ${props => props.theme.spacing[200]}; /* 4-point system: 800px */
  margin: 0 auto;
`

const AcademicCard = styled(Card)<{ status: string; $isVisible?: boolean; $index?: number }>`
  margin-bottom: ${props => props.theme.spacing[4]};
  border-left: ${props => props.theme.spacing[1]} solid ${props => { /* 4-point system: 4px */
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[500]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.border
    }
  }};
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.$isVisible && props.$index !== undefined ? `${props.$index * 0.1}s` : '0s'};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[500]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.border
    }
  }};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    border-radius: ${props => props.theme.radius.sm};
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  }
`

const AcademicTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl}; /* 4-point system: 20px */
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  color: ${props => props.theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const GradeBadge = styled.span<{ grade: string }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => {
    switch (props.grade) {
      case 'HIGH DISTINCTION': return props.theme.colors.error
      case 'DISTINCTION': return props.theme.colors.warning
      case 'CREDIT': return props.theme.colors.success
      case 'PASS': return props.theme.colors.primary[500]
      default: return props.theme.colors.neutral[500]
    }
  }};
  color: ${props => props.theme.colors.hero?.text || '#ffffff'};
`

const StatusBadge = styled.span<{ status: string }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success + '20'
      case 'enrolled': return props.theme.colors.primary[500] + '20'
      case 'exemption': return props.theme.colors.warning + '20'
      default: return props.theme.colors.neutral[100]
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[700]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.textSecondary
    }
  }};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.status === 'completed' ? props.theme.colors.success + '30' :
                  props.status === 'enrolled' ? props.theme.colors.primary[500] + '30' :
                  props.status === 'exemption' ? props.theme.colors.warning + '30' :
                  props.theme.colors.neutral[800]};
  `}
`

const AcademicMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  align-items: center;
  flex-wrap: wrap;
`


const StatCard = styled(Card)<{ $isVisible?: boolean }>`
  text-align: center;
  padding: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary[500]};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    border-radius: ${props => props.theme.radius.sm};
  }
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px */
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.theme.colors.primary[500]};
    margin: 0 0 ${props => props.theme.spacing[2]} 0; /* 4-point system: 8px */
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
  }
`

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  padding: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
`

const SemesterTitle = styled.h2<{ $isVisible?: boolean }>`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-top: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px (1.5rem) */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border-bottom: ${props => props.theme.spacing[0.5]} solid ${props => props.theme.colors.border}; /* 4-point system: 2px → 4px */
  padding-bottom: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

const GradeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  align-items: center;
`

const AcademicDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  margin-top: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
`

const SummaryStats = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.theme.spacing[50]}, 1fr)); /* 4-point system: 200px */
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(${props => props.theme.spacing[40]}, 1fr)); /* 4-point system: 160px */
    gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
    margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

export function AcademicsPage() {
  const { t } = useTranslation()
  const [academics, setAcademics] = useState<Academic[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatsVisible, setIsStatsVisible] = useState(false)
  const [isTimelineVisible, setIsTimelineVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Mock data based on the provided transcript
  const mockAcademicsData: Academic[] = [
    // Current Enrolled Subjects (2025 Spring)
    {
      id: 1,
      name: 'Advanced Software Development',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Advanced concepts in software development, design patterns, and enterprise architecture'
    },
    {
      id: 2,
      name: 'Fundamentals of Interaction Design',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'User experience design, human-computer interaction, and interface design principles'
    },
    {
      id: 3,
      name: 'Project Management and the Professional',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Professional project management methodologies and industry practices'
    },
    {
      id: 4,
      name: 'Interaction Media',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Interactive media design, user experience, and digital interaction principles'
    },
    
    // Completed Subjects (2025 Autumn)
    {
      id: 5,
      name: 'Computer Graphics',
      semester: '2025 AUT',
      grade: 'DISTINCTION',
      marks: 81,
      status: 'completed',
      creditPoints: 6,
      description: '3D graphics programming, rendering techniques, and computer visualization'
    },
    {
      id: 6,
      name: 'Data Structures and Algorithms',
      semester: '2025 AUT',
      grade: 'HIGH DISTINCTION',
      marks: 92,
      status: 'completed',
      creditPoints: 6,
      description: 'Advanced data structures, algorithm analysis, and computational complexity'
    },
    {
      id: 7,
      name: 'Game Design Methodologies',
      semester: '2025 AUT',
      grade: 'PASS',
      marks: 64,
      status: 'completed',
      creditPoints: 6,
      description: 'Game design principles, prototyping, and iterative development processes'
    },
    {
      id: 8,
      name: 'Introduction to Software Development',
      semester: '2025 AUT',
      grade: 'HIGH DISTINCTION',
      marks: 90,
      status: 'completed',
      creditPoints: 6,
      description: 'Software development lifecycle, version control, and collaborative programming'
    },
    
    // Completed Subjects (2024 Spring)
    {
      id: 9,
      name: 'Cloud Computing and Software as a Service',
      semester: '2024 SPR',
      grade: 'HIGH DISTINCTION',
      marks: 86,
      status: 'completed',
      creditPoints: 6,
      description: 'Cloud architecture, microservices, containerization, and SaaS development'
    },
    {
      id: 10,
      name: 'Communication for IT Professionals',
      semester: '2024 SPR',
      grade: 'CREDIT',
      marks: 70,
      status: 'completed',
      creditPoints: 6,
      description: 'Technical communication, documentation, and professional presentation skills'
    },
    {
      id: 11,
      name: 'Introduction to Computer Game Development',
      semester: '2024 SPR',
      grade: 'CREDIT',
      marks: 66,
      status: 'completed',
      creditPoints: 6,
      description: 'Game development fundamentals, Unity engine, and interactive media creation'
    },
    {
      id: 12,
      name: 'Software Architecture',
      semester: '2024 SPR',
      grade: 'DISTINCTION',
      marks: 80,
      status: 'completed',
      creditPoints: 6,
      description: 'Architectural patterns, system design, and scalable software solutions'
    },
    
    // Exemptions
    {
      id: 13,
      name: 'Business Requirements Modelling',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Business analysis, requirements gathering, and process modeling'
    },
    {
      id: 14,
      name: 'Database Fundamentals',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Relational database design, SQL, and data management principles'
    },
    {
      id: 15,
      name: 'Introduction to Information Systems',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Information systems concepts, enterprise systems, and IT governance'
    },
    {
      id: 16,
      name: 'Network Fundamentals',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Network protocols, infrastructure, and distributed systems'
    },
    {
      id: 17,
      name: 'Programming 1',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Fundamental programming concepts and problem-solving techniques'
    },
    {
      id: 18,
      name: 'Programming 2',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Object-oriented programming, data structures, and software design'
    },
    {
      id: 19,
      name: 'Web Systems',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Web development, client-server architecture, and web technologies'
    }
  ]

  useEffect(() => {
    async function fetchAcademics() {
      setLoading(true)
      try {
        // In production, this would fetch from the API
        // const response = await getAcademics({})
        // if (response.success) {
        //   setAcademics(response.data.items)
        // }
        
        // For now, use mock data
        setAcademics(mockAcademicsData)
      } catch (error) {
        console.error('Failed to fetch academics:', error)
        setAcademics(mockAcademicsData) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }
    fetchAcademics()
  }, [])

  // IntersectionObserver for scroll animations
  useEffect(() => {
    if (loading || academics.length === 0) return

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true)
        }
      })
    }, observerOptions)

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsTimelineVisible(true)
        }
      })
    }, observerOptions)

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          const cardId = parseInt(entry.target.dataset.cardId || '0', 10)
          setVisibleCards((prev) => new Set([...prev, cardId]))
        }
      })
    }, observerOptions)

    if (statsRef.current) {
      statsObserver.observe(statsRef.current)
    }
    if (timelineRef.current) {
      timelineObserver.observe(timelineRef.current)
    }

    // Observe all academic cards after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cards = document.querySelectorAll('[data-card-id]')
      cards.forEach((card) => cardObserver.observe(card))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (statsRef.current) statsObserver.unobserve(statsRef.current)
      if (timelineRef.current) timelineObserver.unobserve(timelineRef.current)
      const cards = document.querySelectorAll('[data-card-id]')
      cards.forEach((card) => cardObserver.unobserve(card))
    }
  }, [academics, loading])

  if (loading) {
    return (
      <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
      <Container>
        <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
        <LoadingText>{t('common.loading', 'Loading...')}</LoadingText>
      </Container>
      </PageWrapper>
    )
  }

  // Empty state
  if (academics.length === 0) {
    return (
      <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
        <Container>
          <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
          <LoadingText>{t('academics.notFound', 'Academic information not found')}</LoadingText>
        </Container>
      </PageWrapper>
    )
  }

  // Calculate statistics
  const completedSubjects = academics.filter(a => a.status === 'completed')
  const totalCreditPoints = academics.reduce((sum, a) => sum + (a.creditPoints || 0), 0)
  const completedCreditPoints = completedSubjects.reduce((sum, a) => sum + (a.creditPoints || 0), 0)
  const averageMark = completedSubjects.filter(a => a.marks).reduce((sum, a, _, arr) => sum + (a.marks || 0) / arr.length, 0)
  
  // Group academics by status and semester
  const groupedAcademics = academics.reduce((groups, academic) => {
    const key = academic.status === 'exemption' ? 'exemption' : academic.semester
    if (!groups[key]) groups[key] = []
    groups[key].push(academic)
    return groups
  }, {} as Record<string, Academic[]>)
  
  // Sort groups by semester (most recent first)
  const sortedGroups = Object.entries(groupedAcademics).sort(([a], [b]) => {
    if (a === 'exemption') return 1
    if (b === 'exemption') return -1
    return b.localeCompare(a)
  })

  return (
    <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
    <Container>
      <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
      
        <SummaryStats ref={statsRef} $isVisible={isStatsVisible} role="region" aria-label={t('academics.stats.title', 'Academic Statistics')}>
          <StatCard $isVisible={isStatsVisible} tabIndex={0} role="article" aria-label={t('academics.stats.totalCredits', 'Total Credit Points')}>
          <h3>{totalCreditPoints}</h3>
            <p>{t('academics.stats.totalCredits', 'Total Credit Points')}</p>
        </StatCard>
          <StatCard $isVisible={isStatsVisible} tabIndex={0} role="article" aria-label={t('academics.stats.completedCredits', 'Completed Credit Points')}>
          <h3>{completedCreditPoints}</h3>
            <p>{t('academics.stats.completedCredits', 'Completed Credit Points')}</p>
        </StatCard>
          <StatCard $isVisible={isStatsVisible} tabIndex={0} role="article" aria-label={t('academics.stats.gpa', 'GPA')}>
          <h3>5.88</h3>
            <p>{t('academics.stats.gpa', 'GPA')}</p>
        </StatCard>
          <StatCard $isVisible={isStatsVisible} tabIndex={0} role="article" aria-label={t('academics.stats.wam', 'WAM')}>
          <h3>{averageMark.toFixed(1)}</h3>
            <p>{t('academics.stats.wam', 'WAM (Weighted Average Mark)')}</p>
        </StatCard>
      </SummaryStats>
      
        <TimelineContainer ref={timelineRef} role="region" aria-label={t('academics.timeline.title', 'Academic Timeline')}>
        {sortedGroups.map(([semester, academicGroup]) => (
          <div key={semester}>
              <SemesterTitle $isVisible={isTimelineVisible}>
                {semester === 'exemption' ? t('academics.exemptions', 'Exemptions') : semester}
            </SemesterTitle>
              {academicGroup.map((academic, index) => (
                <AcademicCard 
                  key={academic.id} 
                  status={academic.status}
                  $isVisible={visibleCards.has(academic.id)}
                  $index={index}
                  data-card-id={academic.id}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`academic-${academic.id}-title`}
                >
                  <AcademicTitle id={`academic-${academic.id}-title`}>
                  <span>{academic.name}</span>
                  <GradeContainer>
                      {academic.grade && (
                        <GradeBadge grade={academic.grade} aria-label={t('academics.grade', { grade: academic.grade }, 'Grade: {{grade}}')}>
                          {academic.grade}
                        </GradeBadge>
                      )}
                      <StatusBadge status={academic.status} aria-label={t('academics.status', { status: academic.status }, 'Status: {{status}}')}>
                        {t(`academics.status.${academic.status}`, academic.status.toUpperCase())}
                    </StatusBadge>
                  </GradeContainer>
                </AcademicTitle>
                <AcademicMeta>
                    <span>{t('academics.semester', { semester: academic.semester }, academic.semester)}</span>
                    {academic.marks && (
                      <span>
                        {t('academics.mark', { mark: academic.marks }, 'Mark: {{mark}}')}
                      </span>
                    )}
                    {academic.creditPoints && (
                      <span>
                        {t('academics.creditPoints', { points: academic.creditPoints }, '{{points}} Credit Points')}
                      </span>
                    )}
                </AcademicMeta>
                  {academic.description && (
                    <AcademicDescription>{academic.description}</AcademicDescription>
                  )}
              </AcademicCard>
            ))}
          </div>
        ))}
      </TimelineContainer>
    </Container>
    </PageWrapper>
  )
}
