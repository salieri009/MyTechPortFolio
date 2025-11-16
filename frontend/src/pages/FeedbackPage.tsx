import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/ui/Container'
import { Button, Card } from '@components/common'
import { analytics } from '@services/analytics'
import { sendFeedbackEmail, initEmailService } from '@services/email'

const FeedbackWrapper = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.background};
`

const FeedbackHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[500]};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }
`

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const FeedbackForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Label = styled.label`
  display: block;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.text};
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: inherit;
  resize: vertical;
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  background: ${props => props.theme.colors.primary[500]};
  border: none;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  padding: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.base};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const SuccessCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
`

const SuccessIcon = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const SuccessTitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.text};
`

const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[8]};
`

interface FeedbackData {
  name: string
  email: string
  category: string
  subject: string
  message: string
}

export function FeedbackPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // 컴포넌트 마운트 시 EmailJS 초기화
  useEffect(() => {
    initEmailService()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 실제 이메일 전송
      const response = await sendFeedbackEmail(formData)
      
      if (response.success) {
        setIsSubmitted(true)
        
        // 폼 리셋
        setFormData({
          name: '',
          email: '',
          category: '',
          subject: '',
          message: ''
        })
        
        console.log('피드백이 성공적으로 전송되었습니다!', response.messageId)
      } else {
        throw new Error(response.error || '이메일 전송에 실패했습니다.')
      }
      
    } catch (error) {
      console.error('피드백 전송 실패:', error)
      analytics.error('feedback_submission_failed', 'api')
      alert('죄송합니다. 피드백 전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'general',
    'technical',
    'design',
    'collaboration',
    'bug',
    'other'
  ]

  if (isSubmitted) {
    return (
      <FeedbackWrapper>
        <Container>
          <SuccessCard>
            <SuccessIcon>✅</SuccessIcon>
            <SuccessTitle>{t('feedback.success.title')}</SuccessTitle>
            <SuccessMessage>
              {t('feedback.success.message')}
            </SuccessMessage>
            <Button onClick={() => setIsSubmitted(false)}>
              {t('feedback.success.newFeedback')}
            </Button>
          </SuccessCard>
        </Container>
      </FeedbackWrapper>
    )
  }

  return (
    <FeedbackWrapper>
      <Container>
        <FeedbackHeader>
          <Title>{t('feedback.title')}</Title>
          <Subtitle>
            {t('feedback.subtitle')}
          </Subtitle>
        </FeedbackHeader>

        <Card>
          <FeedbackForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                {t('feedback.form.name')} *
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('feedback.form.placeholder.name')}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                {t('feedback.form.email')} *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('feedback.form.placeholder.email')}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">
                {t('feedback.form.category')}
              </Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  {t('feedback.form.placeholder.category')}
                </option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(`feedback.form.categories.${category}`)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">
                {t('feedback.form.subject')} *
              </Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder={t('feedback.form.placeholder.subject')}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">
                {t('feedback.form.message')} *
              </Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder={t('feedback.form.placeholder.message')}
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('feedback.form.submitting') : t('feedback.form.submit')}
            </SubmitButton>
          </FeedbackForm>
        </Card>
      </Container>
    </FeedbackWrapper>
  )
}
