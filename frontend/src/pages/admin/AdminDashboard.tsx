import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { projectsApi } from '../../services/admin/projectsApi'
import { academicsApi } from '../../services/admin/academicsApi'
import { milestonesApi } from '../../services/admin/milestonesApi'
import styled from 'styled-components'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { SkeletonCard } from '../../components/admin/SkeletonCard'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

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
  background: #FFFFFF; /* neutral-0 - H4: Consistency */
  border: 1px solid #E5E7EB; /* neutral-200 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease; /* H1: Visibility - Immediate feedback */
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: #6B7280; /* neutral-500 - H1: Visibility - Clear secondary text */
  margin-bottom: ${props => props.theme.spacing[2]};
`

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: #111827; /* neutral-900 - H1: Visibility - Clear primary text */
  position: relative;
  
  /* H1: Visibility - Loading indicator */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -20px;
    width: 4px;
    height: 100%;
    background: #3B82F6; /* primary-500 */
    opacity: 0;
    transition: opacity 200ms ease;
  }
`

const StatValueLoading = styled(StatValue)`
  &::after {
    opacity: 1;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[8]};
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: #111827; /* neutral-900 - H4: Consistency */
  margin-bottom: ${props => props.theme.spacing[4]};
`

const QuickActionCard = styled(StatCard)`
  cursor: pointer;
  text-align: center;
  
  &:hover {
    background: #EFF6FF; /* primary-50 */
    border-color: #3B82F6; /* primary-500 */
  }
  
  transition: all 200ms ease;
`

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); /* primary-500 to primary-600 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[8]};
  color: #FFFFFF; /* neutral-0 */
  margin-bottom: ${props => props.theme.spacing[8]};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
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

  // H1: Visibility of System Status - Show skeleton UI instead of blank screen
  if (isLoading) {
    return (
      <DashboardContainer>
        <WelcomeCard>
          <WelcomeTitle>Loading Dashboard...</WelcomeTitle>
          <WelcomeText>Please wait while we load your statistics.</WelcomeText>
        </WelcomeCard>
        <Section>
          <SectionTitle>Statistics</SectionTitle>
          <StatsGrid>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </StatsGrid>
        </Section>
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
          <Link to="/admin/projects/new" style={{ textDecoration: 'none' }}>
            <QuickActionCard>
              <StatLabel>Create New Project</StatLabel>
              <StatValue style={{ color: '#3B82F6' }}>+</StatValue>
            </QuickActionCard>
          </Link>
          <Link to="/admin/academics/new" style={{ textDecoration: 'none' }}>
            <QuickActionCard>
              <StatLabel>Add Academic Record</StatLabel>
              <StatValue style={{ color: '#3B82F6' }}>+</StatValue>
            </QuickActionCard>
          </Link>
          <Link to="/admin/testimonials/new" style={{ textDecoration: 'none' }}>
            <QuickActionCard>
              <StatLabel>Add Testimonial</StatLabel>
              <StatValue style={{ color: '#3B82F6' }}>+</StatValue>
            </QuickActionCard>
          </Link>
        </StatsGrid>
      </Section>
    </DashboardContainer>
  )
}

