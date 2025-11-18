import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { testimonialsApi, type Testimonial, type TestimonialCreateRequest, type TestimonialUpdateRequest, type TestimonialType, type TestimonialSource } from '../../../services/admin/testimonialsApi'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import styled from 'styled-components'

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Form = styled.form`
  background: ${props => props.theme.colors.surface || '#ffffff'};
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing[2]};
  font-weight: ${props => props.theme.typography.fontWeight.medium || '500'};
  color: ${props => props.theme.colors.text};
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary?.[500] || props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary?.[100] || 'rgba(59, 130, 246, 0.1)'};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary?.[500] || props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary?.[100] || 'rgba(59, 130, 246, 0.1)'};
  }
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.md || '8px'};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary?.[500] || props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary?.[100] || 'rgba(59, 130, 246, 0.1)'};
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`

const FormActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
`

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error || '#ef4444'};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing[1]};
`

const RatingInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  align-items: center;
`

const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.$active ? '#fbbf24' : '#d1d5db'};
  padding: 0;
  
  &:hover {
    color: #fbbf24;
  }
`

interface TestimonialFormProps {
  mode: 'create' | 'edit'
}

export function TestimonialForm({ mode }: TestimonialFormProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<TestimonialCreateRequest>({
    authorName: '',
    authorTitle: '',
    authorCompany: '',
    authorEmail: '',
    authorLinkedInUrl: '',
    content: '',
    rating: 5,
    type: 'CLIENT',
    source: 'MANUAL',
    isFeatured: false,
    displayOrder: 0
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadTestimonial()
    }
  }, [mode, id])

  const loadTestimonial = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const testimonial = await testimonialsApi.getById(id)
      setFormData({
        authorName: testimonial.authorName,
        authorTitle: testimonial.authorTitle || '',
        authorCompany: testimonial.authorCompany || '',
        authorEmail: '',
        authorLinkedInUrl: testimonial.authorLinkedInUrl || '',
        content: testimonial.content,
        rating: testimonial.rating || 5,
        type: testimonial.type as TestimonialType,
        source: testimonial.source as TestimonialSource,
        isFeatured: testimonial.isFeatured || false,
        displayOrder: testimonial.displayOrder || 0,
        projectId: testimonial.projectId
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonial')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === 'create') {
        await testimonialsApi.create(formData)
      } else if (id) {
        await testimonialsApi.update(id, formData)
      }
      navigate('/admin/testimonials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const setRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  if (isLoading) {
    return (
      <FormContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {mode === 'create' ? 'Create Testimonial' : 'Edit Testimonial'}
        </h2>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="authorName">Author Name *</Label>
          <Input
            id="authorName"
            name="authorName"
            type="text"
            value={formData.authorName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="authorTitle">Author Title</Label>
          <Input
            id="authorTitle"
            name="authorTitle"
            type="text"
            value={formData.authorTitle}
            onChange={handleChange}
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="authorCompany">Company</Label>
          <Input
            id="authorCompany"
            name="authorCompany"
            type="text"
            value={formData.authorCompany}
            onChange={handleChange}
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="authorEmail">Email</Label>
          <Input
            id="authorEmail"
            name="authorEmail"
            type="email"
            value={formData.authorEmail}
            onChange={handleChange}
            maxLength={255}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="authorLinkedInUrl">LinkedIn URL</Label>
          <Input
            id="authorLinkedInUrl"
            name="authorLinkedInUrl"
            type="url"
            value={formData.authorLinkedInUrl}
            onChange={handleChange}
            maxLength={500}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content *</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={2000}
            rows={6}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="rating">Rating</Label>
          <RatingInput>
            {[1, 2, 3, 4, 5].map(star => (
              <StarButton
                key={star}
                type="button"
                $active={star <= (formData.rating || 0)}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </StarButton>
            ))}
            <span style={{ marginLeft: '0.5rem' }}>
              {formData.rating || 0} / 5
            </span>
          </RatingInput>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating || ''}
            onChange={handleChange}
            style={{ marginTop: '0.5rem', width: '100px' }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="type">Type *</Label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="CLIENT">Client</option>
            <option value="COLLEAGUE">Colleague</option>
            <option value="MENTOR">Mentor</option>
            <option value="PROFESSOR">Professor</option>
            <option value="OTHER">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="source">Source</Label>
          <Select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="MANUAL">Manual</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="EMAIL">Email</option>
            <option value="OTHER">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            name="displayOrder"
            type="number"
            value={formData.displayOrder || 0}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <Label htmlFor="isFeatured" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Featured Testimonial
            </Label>
          </CheckboxContainer>
        </FormGroup>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/testimonials')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  )
}

