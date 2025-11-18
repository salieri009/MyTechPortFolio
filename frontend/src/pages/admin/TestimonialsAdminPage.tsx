import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testimonialsApi, type Testimonial, type TestimonialType } from '../../services/admin/testimonialsApi'
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

const FiltersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[4]};
  background: #FFFFFF; /* neutral-0 - H4: Consistency */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  border: 1px solid #E5E7EB; /* neutral-200 */
`

const Select = styled.select`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border: 1px solid #E5E7EB; /* neutral-200 */
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: #111827; /* neutral-900 */
  background: #FFFFFF; /* neutral-0 */
  transition: all 200ms ease; /* H1: Visibility - Immediate feedback */
  
  &:focus {
    outline: none;
    border-color: #3B82F6; /* primary-500 */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* primary-500 with opacity */
  }
`

const ClearFiltersLink = styled.button`
  background: none;
  border: none;
  color: #6B7280; /* neutral-500 - H3: User Control and Freedom */
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 200ms ease;
  
  &:hover {
    color: #111827; /* neutral-900 */
  }
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

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.full || '9999px'};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium || '500'};
  /* H2: Match Between System and the Real World - Color coding */
  background: ${props => {
    switch (props.$type) {
      case 'CLIENT': return '#DBEAFE' /* primary-100 */
      case 'COLLEAGUE': return '#D1FAE5' /* success-500 light */
      case 'MENTOR': return '#FEF3C7' /* warning-500 light */
      case 'PROFESSOR': return '#DBEAFE' /* primary-100 */
      default: return '#F3F4F6' /* neutral-100 */
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'CLIENT': return '#1E40AF' /* primary-800 */
      case 'COLLEAGUE': return '#065F46' /* success-500 dark */
      case 'MENTOR': return '#92400E' /* warning-500 dark */
      case 'PROFESSOR': return '#1E40AF' /* primary-800 */
      default: return '#374151' /* neutral-700 */
    }
  }};
`

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#fbbf24' : '#d1d5db'};
  font-size: 14px;
`

const ContentPreview = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
  color: #6B7280; /* neutral-500 */
  background: #FFFFFF; /* neutral-0 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  border: 1px solid #E5E7EB; /* neutral-200 */
`

export function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<TestimonialType | ''>('')
  const [ratingFilter, setRatingFilter] = useState<number | ''>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; testimonialId: string | null; authorName: string }>({
    isOpen: false,
    testimonialId: null,
    authorName: ''
  })

  useEffect(() => {
    loadTestimonials()
  }, [typeFilter, ratingFilter])

  const loadTestimonials = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const filters: any = {}
      if (typeFilter) {
        filters.type = typeFilter
      }
      if (ratingFilter) {
        filters.minRating = ratingFilter
      }
      
      const data = await testimonialsApi.getAll(filters)
      setTestimonials(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials')
      console.error('Failed to load testimonials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // H3: User Control and Freedom - Clear all filters function
  const clearFilters = () => {
    setTypeFilter('')
    setRatingFilter('')
  }

  // H5: Error Prevention - Show confirmation modal instead of browser confirm
  const handleDeleteClick = (id: string, authorName: string) => {
    setDeleteModal({
      isOpen: true,
      testimonialId: id,
      authorName: authorName
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.testimonialId) return

    try {
      await testimonialsApi.delete(deleteModal.testimonialId)
      setDeleteModal({ isOpen: false, testimonialId: null, authorName: '' })
      await loadTestimonials()
    } catch (err) {
      alert('Failed to delete testimonial: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setDeleteModal({ isOpen: false, testimonialId: null, authorName: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, testimonialId: null, authorName: '' })
  }

  const renderRating = (rating?: number) => {
    if (!rating) return '-'
    return (
      <RatingDisplay>
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} $filled={star <= rating}>★</Star>
        ))}
        <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>({rating})</span>
      </RatingDisplay>
    )
  }

  if (isLoading && testimonials.length === 0) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </PageContainer>
    )
  }

  if (error && testimonials.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <p>Error: {error}</p>
          <Button onClick={loadTestimonials}>Retry</Button>
        </EmptyState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Testimonials</PageTitle>
        <Link to="/admin/testimonials/new">
          <Button variant="primary">Create New Testimonial</Button>
        </Link>
      </PageHeader>

      <FiltersContainer>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Filter by Type:
          </label>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TestimonialType | '')}
          >
            <option value="">All Types</option>
            <option value="CLIENT">Client</option>
            <option value="COLLEAGUE">Colleague</option>
            <option value="MENTOR">Mentor</option>
            <option value="PROFESSOR">Professor</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Min Rating:
          </label>
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value, 10) : '')}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </Select>
        </div>
        {/* H3: User Control and Freedom - Clear All Filters as text link */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          {(typeFilter || ratingFilter) && (
            <ClearFiltersLink onClick={clearFilters}>
              Clear All Filters
            </ClearFiltersLink>
          )}
        </div>
      </FiltersContainer>

      {/* H9: Help Users Recognize, Diagnose, and Recover from Errors - Empty state with recovery action */}
      {testimonials.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
            {typeFilter || ratingFilter ? 'No testimonials match your filters.' : 'No testimonials found.'}
          </p>
          <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
            {typeFilter || ratingFilter 
              ? 'Try adjusting your filters or clear them to see all testimonials.'
              : 'Create your first testimonial to get started!'}
          </p>
          {typeFilter || ratingFilter ? (
            <ClearFiltersLink onClick={clearFilters} style={{ fontSize: '1rem', marginRight: '1rem' }}>
              Clear Filters
            </ClearFiltersLink>
          ) : null}
          <Link to="/admin/testimonials/new">
            <Button variant="primary" style={{ marginTop: '1rem' }}>
              Create Your First Testimonial
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Author</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Rating</TableHeaderCell>
              <TableHeaderCell>Content</TableHeaderCell>
              <TableHeaderCell>Featured</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {testimonials.map(testimonial => (
              <TableRow key={testimonial.id}>
                <TableCell>
                  <div>
                    <strong>{testimonial.authorName}</strong>
                    {testimonial.authorTitle && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {testimonial.authorTitle}
                        {testimonial.authorCompany && ` at ${testimonial.authorCompany}`}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <TypeBadge $type={testimonial.type}>{testimonial.type}</TypeBadge>
                </TableCell>
                <TableCell>
                  {renderRating(testimonial.rating)}
                </TableCell>
                <TableCell>
                  <ContentPreview title={testimonial.content}>
                    {testimonial.content}
                  </ContentPreview>
                </TableCell>
                <TableCell>
                  {testimonial.isFeatured ? '⭐' : '-'}
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Link to={`/admin/testimonials/${testimonial.id}/edit`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    {/* H5: Error Prevention - Delete button with error-500 color */}
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(testimonial.id, testimonial.authorName)}
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
      )}

      {/* H5: Error Prevention - Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteModal.authorName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </PageContainer>
  )
}

