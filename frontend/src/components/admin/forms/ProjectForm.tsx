import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { projectsApi, type Project, type ProjectCreateRequest, type ProjectUpdateRequest } from '../../../services/admin/projectsApi'
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

interface ProjectFormProps {
  mode: 'create' | 'edit'
}

export function ProjectForm({ mode }: ProjectFormProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProjectCreateRequest>({
    title: '',
    summary: '',
    description: '',
    startDate: '',
    endDate: '',
    githubUrl: '',
    demoUrl: '',
    techStackIds: [],
    academicIds: [],
    isFeatured: false,
    status: 'COMPLETED'
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadProject()
    }
  }, [mode, id])

  const loadProject = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const project = await projectsApi.getById(id)
      setFormData({
        title: project.title,
        summary: project.summary,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        techStackIds: project.techStackIds,
        academicIds: project.relatedAcademicIds || [],
        isFeatured: project.isFeatured,
        status: project.status
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
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
        await projectsApi.create(formData)
      } else if (id) {
        await projectsApi.update(id, formData)
      }
      navigate('/admin/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
      </h1>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={255}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="summary">Summary *</Label>
          <TextArea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={500}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={10000}
            style={{ minHeight: '200px' }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={formData.startDate}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <Label htmlFor="isFeatured" style={{ margin: 0, cursor: 'pointer' }}>
              Featured Project (Show on homepage)
            </Label>
          </CheckboxContainer>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="techStackIds">Tech Stack IDs (comma-separated)</Label>
          <Input
            type="text"
            id="techStackIds"
            name="techStackIds"
            value={formData.techStackIds.join(', ')}
            onChange={(e) => {
              const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean)
              setFormData(prev => ({ ...prev, techStackIds: ids }))
            }}
            placeholder="tech-id-1, tech-id-2, tech-id-3"
          />
          <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Enter MongoDB ObjectIds separated by commas
          </small>
        </FormGroup>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/projects')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  )
}

