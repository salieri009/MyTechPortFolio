import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsApi, type Project, type ProjectFilters } from '../../services/admin/projectsApi'
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary || '#f9fafb'};
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary || '#f9fafb'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing[4]};
  text-align: left;
  font-weight: ${props => props.theme.typography.fontWeight.semibold || '600'};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const TableCell = styled.td`
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
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
      case 'IN_PROGRESS': return props.theme.colors.warning?.[100] || '#fef3c7'
      case 'PLANNING': return props.theme.colors.info?.[100] || '#dbeafe'
      default: return props.theme.colors.gray?.[100] || '#f3f4f6'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'COMPLETED': return props.theme.colors.success?.[700] || '#065f46'
      case 'IN_PROGRESS': return props.theme.colors.warning?.[700] || '#92400e'
      case 'PLANNING': return props.theme.colors.info?.[700] || '#1e40af'
      default: return props.theme.colors.gray?.[700] || '#374151'
    }
  }};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
`

export function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadProjects()
  }, [page])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await projectsApi.getAll(page, 10)
      setProjects(response.items)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      console.error('Failed to load projects:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      await projectsApi.delete(id)
      await loadProjects() // Reload list
    } catch (err) {
      alert('Failed to delete project: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (isLoading && projects.length === 0) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </PageContainer>
    )
  }

  if (error && projects.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <p>Error: {error}</p>
          <Button onClick={loadProjects}>Retry</Button>
        </EmptyState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Projects</PageTitle>
        <Link to="/admin/projects/new">
          <Button variant="primary">Create New Project</Button>
        </Link>
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState>
          <p>No projects found. Create your first project!</p>
          <Link to="/admin/projects/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>Create Project</Button>
          </Link>
        </EmptyState>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Featured</TableHeaderCell>
                <TableHeaderCell>Start Date</TableHeaderCell>
                <TableHeaderCell>End Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    <StatusBadge $status={project.status}>{project.status}</StatusBadge>
                  </TableCell>
                  <TableCell>{project.isFeatured ? '⭐' : '-'}</TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Link to={`/admin/projects/${project.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginTop: '2rem' 
            }}>
              <Button 
                variant="secondary" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 1rem' 
              }}>
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="secondary" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}

