import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Card } from '@components/common'
import { getAcademics } from '@services/academics'
import type { Academic } from '@model/domain'

const TimelineContainer = styled.div`
  max-width: ${props => props.theme.spacing[200]}; /* 4-point system: 800px */
  margin: 0 auto;
`

const AcademicCard = styled(Card)<{ status: string }>`
  margin-bottom: ${props => props.theme.spacing[4]};
  border-left: ${props => props.theme.spacing[1]} solid ${props => { /* 4-point system: 4px */
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[500]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.border
    }
  }};
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
  color: white;
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

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.theme.spacing[50]}, 1fr)); /* 4-point system: 200px */
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
`

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[5]}; /* 4-point system: 20px → 24px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
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
`

const SemesterTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-top: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px (1.5rem) */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding-bottom: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
`

const GradeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  align-items: center;
`

const AcademicDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`

export function AcademicsPage() {
  const { t } = useTranslation()
  const [academics, setAcademics] = useState<Academic[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <Container>
        <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
        <LoadingText>{t('common.loading', 'Loading...')}</LoadingText>
      </Container>
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
    <Container>
      <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
      
      <SummaryStats>
        <StatCard>
          <h3>{totalCreditPoints}</h3>
          <p>Total Credit Points</p>
        </StatCard>
        <StatCard>
          <h3>{completedCreditPoints}</h3>
          <p>Completed Credit Points</p>
        </StatCard>
        <StatCard>
          <h3>5.88</h3>
          <p>GPA</p>
        </StatCard>
        <StatCard>
          <h3>{averageMark.toFixed(1)}</h3>
          <p>WAM (Weighted Average Mark)</p>
        </StatCard>
      </SummaryStats>
      
      <TimelineContainer>
        {sortedGroups.map(([semester, academicGroup]) => (
          <div key={semester}>
            <SemesterTitle>
              {semester === 'exemption' ? 'Exemptions' : semester}
            </SemesterTitle>
            {academicGroup.map((academic) => (
              <AcademicCard key={academic.id} status={academic.status}>
                <AcademicTitle>
                  <span>{academic.name}</span>
                  <GradeContainer>
                    {academic.grade && <GradeBadge grade={academic.grade}>{academic.grade}</GradeBadge>}
                    <StatusBadge status={academic.status}>
                      {academic.status.toUpperCase()}
                    </StatusBadge>
                  </GradeContainer>
                </AcademicTitle>
                <AcademicMeta>
                  <span>{academic.semester}</span>
                  {academic.marks && <span>Mark: {academic.marks}</span>}
                  {academic.creditPoints && <span>{academic.creditPoints} Credit Points</span>}
                </AcademicMeta>
                {academic.description && <AcademicDescription>{academic.description}</AcademicDescription>}
              </AcademicCard>
            ))}
          </div>
        ))}
      </TimelineContainer>
    </Container>
  )
}
