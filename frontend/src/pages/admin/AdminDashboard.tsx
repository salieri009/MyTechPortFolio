import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { projectsApi } from '../../services/admin/projectsApi'
import { academicsApi } from '../../services/admin/academicsApi'
import { milestonesApi } from '../../services/admin/milestonesApi'
import styled from 'styled-components'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[8]};
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary?.[500] || '#3b82f6'} 0%, ${props => props.theme.colors.primary?.[600] || '#2563eb'} 100%);
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[8]};
  color: white;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const WelcomeText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  opacity: 0.9;
`

interface DashboardStats {
  totalProjects: number
  totalAcademics: number
  totalMilestones: number
  featuredProjects: number
}

export function AdminDashboard() {
  const { user } = useAdminStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalAcademics: 0,
    totalMilestones: 0,
    featuredProjects: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        
        // Load projects
        const projectsData = await projectsApi.getAll(1, 1)
        const allProjects = await projectsApi.getAll(1, 1000) // Get all for featured count
        
        // Load academics
        const academicsData = await academicsApi.getAll(1, 1)
        
        // Load milestones
        const milestonesData = await milestonesApi.getAll()
        
        setStats({
          totalProjects: projectsData.total,
          totalAcademics: academicsData.total,
          totalMilestones: milestonesData.length,
          featuredProjects: allProjects.items.filter(p => p.isFeatured).length
        })
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <WelcomeCard>
        <WelcomeTitle>Welcome back, {user?.fullName || user?.username || 'Admin'}!</WelcomeTitle>
        <WelcomeText>
          Manage your portfolio content from this dashboard. You can create, edit, and delete projects, academics, and journey milestones.
        </WelcomeText>
      </WelcomeCard>

      <Section>
        <SectionTitle>Statistics</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatLabel>Total Projects</StatLabel>
            <StatValue>{stats.totalProjects}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Featured Projects</StatLabel>
            <StatValue>{stats.featuredProjects}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Academic Records</StatLabel>
            <StatValue>{stats.totalAcademics}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Journey Milestones</StatLabel>
            <StatValue>{stats.totalMilestones}</StatValue>
          </StatCard>
        </StatsGrid>
      </Section>

      <Section>
        <SectionTitle>Quick Actions</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatLabel>Create New Project</StatLabel>
            <StatValue>+</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Add Academic Record</StatLabel>
            <StatValue>+</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Add Milestone</StatValue>
            <StatValue>+</StatValue>
          </StatCard>
        </StatsGrid>
      </Section>
    </DashboardContainer>
  )
}

