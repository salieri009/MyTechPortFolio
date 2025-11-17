import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { milestonesApi, type JourneyMilestone } from '../../services/admin/milestonesApi'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Button } from '../../components/ui/Button'
import styled from 'styled-components'

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const MilestonesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const MilestoneCard = styled.div`
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MilestoneInfo = styled.div`
  flex: 1;
`

const MilestoneTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
`

const MilestoneMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.full || '9999px'};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium || '500'};
  background: ${props => {
    switch (props.$status) {
      case 'COMPLETED': return props.theme.colors.success?.[100] || '#d1fae5'
      case 'CURRENT': return props.theme.colors.warning?.[100] || '#fef3c7'
      case 'PLANNED': return props.theme.colors.info?.[100] || '#dbeafe'
      default: return props.theme.colors.gray?.[100] || '#f3f4f6'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'COMPLETED': return props.theme.colors.success?.[700] || '#065f46'
      case 'CURRENT': return props.theme.colors.warning?.[700] || '#92400e'
      case 'PLANNED': return props.theme.colors.info?.[700] || '#1e40af'
      default: return props.theme.colors.gray?.[700] || '#374151'
    }
  }};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
`

export function JourneyMilestonesAdminPage() {
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMilestones()
  }, [])

  const loadMilestones = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await milestonesApi.getAll()
      setMilestones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load milestones')
      console.error('Failed to load milestones:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) {
      return
    }

    try {
      await milestonesApi.delete(id)
      await loadMilestones()
    } catch (err) {
      alert('Failed to delete milestone: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </PageContainer>
    )
  }

  if (error && milestones.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <p>Error: {error}</p>
          <Button onClick={loadMilestones}>Retry</Button>
        </EmptyState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Journey Milestones</PageTitle>
        <Link to="/admin/milestones/new">
          <Button variant="primary">Create New Milestone</Button>
        </Link>
      </PageHeader>

      {milestones.length === 0 ? (
        <EmptyState>
          <p>No milestones found. Create your first milestone!</p>
          <Link to="/admin/milestones/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>Create Milestone</Button>
          </Link>
        </EmptyState>
      ) : (
        <MilestonesList>
          {milestones.map(milestone => (
            <MilestoneCard key={milestone.id}>
              <MilestoneInfo>
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneMeta>
                  <span>Year: {milestone.year}</span>
                  <StatusBadge $status={milestone.status}>{milestone.status}</StatusBadge>
                  <span>Complexity: {milestone.technicalComplexity}/5</span>
                  <span>Projects: {milestone.projectCount}</span>
                </MilestoneMeta>
                {milestone.description && (
                  <p style={{ 
                    marginTop: '0.5rem', 
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    {milestone.description.length > 100 
                      ? milestone.description.substring(0, 100) + '...' 
                      : milestone.description}
                  </p>
                )}
              </MilestoneInfo>
              <ActionButtons>
                <Link to={`/admin/milestones/${milestone.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(milestone.id)}
                >
                  Delete
                </Button>
              </ActionButtons>
            </MilestoneCard>
          ))}
        </MilestonesList>
      )}
    </PageContainer>
  )
}

