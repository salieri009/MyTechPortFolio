import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { academicsApi, type Academic, type AcademicFilters } from '../../services/admin/academicsApi'
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: ${props => props.theme.colors.textSecondary || '#6b7280'};
`

export function AcademicsAdminPage() {
  const [academics, setAcademics] = useState<Academic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this academic record?')) {
      return
    }

    try {
      await academicsApi.delete(id)
      await loadAcademics()
    } catch (err) {
      alert('Failed to delete academic record: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
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

      {academics.length === 0 ? (
        <EmptyState>
          <p>No academic records found. Create your first record!</p>
          <Link to="/admin/academics/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>Create Academic</Button>
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
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(academic.id)}
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

