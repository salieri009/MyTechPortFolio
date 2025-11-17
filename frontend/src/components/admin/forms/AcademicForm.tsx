import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { academicsApi, type Academic, type AcademicCreateRequest, type AcademicUpdateRequest } from '../../../services/admin/academicsApi'
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

interface AcademicFormProps {
  mode: 'create' | 'edit'
}

export function AcademicForm({ mode }: AcademicFormProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<AcademicCreateRequest>({
    name: '',
    semester: '',
    grade: '',
    description: ''
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadAcademic()
    }
  }, [mode, id])

  const loadAcademic = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const academic = await academicsApi.getById(id)
      setFormData({
        name: academic.name,
        semester: academic.semester,
        grade: academic.grade || '',
        description: academic.description || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load academic')
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
        await academicsApi.create(formData)
      } else if (id) {
        await academicsApi.update(id, formData)
      }
      navigate('/admin/academics')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save academic')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      <h1 style={{ marginBottom: '2rem' }}>
        {mode === 'create' ? 'Create New Academic Record' : 'Edit Academic Record'}
      </h1>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="name">Course Name *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={255}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="semester">Semester *</Label>
          <Input
            type="text"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            placeholder="e.g., 2024-1, 2024 AUT"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="grade">Grade</Label>
          <Input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="e.g., HD, D, C, P, 92"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={5000}
          />
        </FormGroup>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/academics')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {mode === 'create' ? 'Create Academic' : 'Save Changes'}
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  )
}

