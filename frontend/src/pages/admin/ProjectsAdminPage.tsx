import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsApi, type Project, type ProjectFilters } from '../../services/admin/projectsApi'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Button } from '../../components/ui/Button'
import { ConfirmationModal } from '../../components/admin/ConfirmationModal'
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
  color: #111827; /* neutral-900 - H4: Consistency */
  margin: 0;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #FFFFFF; /* neutral-0 - H4: Consistency */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.thead`
  background: #EFF6FF; /* primary-50 - H4: Consistency */
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
  color: #6B7280; /* neutral-500 - H4: Consistency */
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const TableCell = styled.td`
  padding: ${props => props.theme.spacing[4]};
  color: #111827; /* neutral-900 */
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
  /* H2: Match Between System and the Real World - Traffic light system */
  background: ${props => {
    switch (props.$status) {
      case 'COMPLETED': return '#D1FAE5' /* success-500 light */
      case 'IN_PROGRESS': return '#FEF3C7' /* warning-500 light */
      case 'PLANNING': return '#EFF6FF' /* primary-50 */
      case 'ARCHIVED': return '#F3F4F6' /* neutral-100 */
      default: return '#F3F4F6' /* neutral-100 */
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'COMPLETED': return '#065F46' /* success-500 dark */
      case 'IN_PROGRESS': return '#92400E' /* warning-500 dark */
      case 'PLANNING': return '#1E40AF' /* primary-800 */
      case 'ARCHIVED': return '#374151' /* neutral-700 */
      default: return '#374151' /* neutral-700 */
    }
  }};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: #6B7280; /* neutral-500 */
  background: #FFFFFF; /* neutral-0 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  border: 1px solid #E5E7EB; /* neutral-200 */
`

export function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; projectId: string | null; projectTitle: string }>({
    isOpen: false,
    projectId: null,
    projectTitle: ''
  })

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

  // H5: Error Prevention - Show confirmation modal instead of browser confirm
  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      projectId: id,
      projectTitle: title
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.projectId) return

    try {
      await projectsApi.delete(deleteModal.projectId)
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' })
      await loadProjects() // Reload list
    } catch (err) {
      alert('Failed to delete project: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' })
  }

  // H2: Match Between System and the Real World - User-friendly status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'COMPLETED': return 'Published'
      case 'IN_PROGRESS': return 'In Progress'
      case 'PLANNING': return 'Draft'
      case 'ARCHIVED': return 'Archived'
      default: return status
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

      {/* H9: Help Users Recognize, Diagnose, and Recover from Errors - Empty state with recovery action */}
      {projects.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
            No projects found.
          </p>
          <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
            Create your first project to get started!
          </p>
          <Link to="/admin/projects/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>
              Create Your First Project
            </Button>
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
                    {/* H2: Match Between System and the Real World - User-friendly text */}
                    <StatusBadge $status={project.status}>
                      {getStatusText(project.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{project.isFeatured ? '⭐' : '-'}</TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Link to={`/admin/projects/${project.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      {/* H5: Error Prevention - Delete button with error-500 color */}
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(project.id, project.title)}
                        style={{ 
                          background: '#EF4444', /* error-500 */
                          color: '#FFFFFF'
                        }}
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

      {/* H5: Error Prevention - Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </PageContainer>
  )
}

