import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { academicsApi, type Academic, type AcademicFilters } from '../../services/admin/academicsApi'
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: #6B7280; /* neutral-500 */
  background: #FFFFFF; /* neutral-0 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  border: 1px solid #E5E7EB; /* neutral-200 */
`

export function AcademicsAdminPage() {
  const [academics, setAcademics] = useState<Academic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; academicId: string | null; academicName: string }>({
    isOpen: false,
    academicId: null,
    academicName: ''
  })

  useEffect(() => {
    loadAcademics()
  }, [page])

  const loadAcademics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await academicsApi.getAll(page, 10)
      setAcademics(response.items)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load academics')
      console.error('Failed to load academics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // H5: Error Prevention - Show confirmation modal instead of browser confirm
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      academicId: id,
      academicName: name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.academicId) return

    try {
      await academicsApi.delete(deleteModal.academicId)
      setDeleteModal({ isOpen: false, academicId: null, academicName: '' })
      await loadAcademics()
    } catch (err) {
      alert('Failed to delete academic record: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setDeleteModal({ isOpen: false, academicId: null, academicName: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, academicId: null, academicName: '' })
  }

  if (isLoading && academics.length === 0) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </PageContainer>
    )
  }

  if (error && academics.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <p>Error: {error}</p>
          <Button onClick={loadAcademics}>Retry</Button>
        </EmptyState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Academics</PageTitle>
        <Link to="/admin/academics/new">
          <Button variant="primary">Create New Academic</Button>
        </Link>
      </PageHeader>

      {/* H9: Help Users Recognize, Diagnose, and Recover from Errors - Empty state with recovery action */}
      {academics.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
            No academic records found.
          </p>
          <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
            Create your first academic record to get started!
          </p>
          <Link to="/admin/academics/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>
              Create Your First Academic Record
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Semester</TableHeaderCell>
                <TableHeaderCell>Grade</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {academics.map(academic => (
                <TableRow key={academic.id}>
                  <TableCell>{academic.name}</TableCell>
                  <TableCell>{academic.semester}</TableCell>
                  <TableCell>{academic.grade || '-'}</TableCell>
                  <TableCell>
                    {academic.description 
                      ? (academic.description.length > 50 
                          ? academic.description.substring(0, 50) + '...' 
                          : academic.description)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Link to={`/admin/academics/${academic.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      {/* H5: Error Prevention - Delete button with error-500 color */}
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(academic.id, academic.name)}
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
        title="Delete Academic Record"
        message={`Are you sure you want to delete "${deleteModal.academicName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </PageContainer>
  )
}

