import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '@components/common'
import { analytics } from '@services/analytics'
import { sendFeedbackEmail, initEmailService } from '@services/email'
import { useFeedbackModalStore } from '../../stores/feedbackModalStore'
import { CheckMarkIcon } from '@components/icons/CheckMarkIcon'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]});
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Feedback Modal Overlay - Full screen immersive experience (T1)
const FeedbackModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => {
    // Use theme-aware background color with 0.9 opacity (T1)
    const overlayColor = props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[950] 
      : props.theme.colors.neutral[900]
    const hex = overlayColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.9)`
  }};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[6]};
  animation: ${fadeIn} 300ms ease;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const FeedbackModalContent = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-radius: ${props => props.theme.radius['2xl']};
  padding: ${props => props.theme.spacing[12]};
  max-width: ${props => props.theme.spacing[150] || '37.5rem'}; /* 600px */
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 300ms ease;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[8]};
    max-height: 95vh;
  }
`

const FeedbackModalCloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing[6]};
  right: ${props => props.theme.spacing[6]};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radius.md};
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.mode === 'dark' 
      ? props.theme.colors.neutral[800] 
      : props.theme.colors.neutral[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
  }
`

const CloseIcon = styled.svg`
  width: ${props => props.theme.spacing[6]};
  height: ${props => props.theme.spacing[6]};
  stroke: currentColor;
  stroke-width: 2;
`

const FeedbackHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Title = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[500]};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }
`

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  max-width: ${props => props.theme.spacing[150]};
  margin: 0 auto;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const FeedbackForm = styled.form`
  max-width: ${props => props.theme.spacing[150]};
  margin: 0 auto;
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Label = styled.label`
  display: block;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
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
  font-family: ${props => props.theme.typography.fontFamily.primary};
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props => props.theme.spacing[0.75]} ${props => props.theme.colors.primary[100]};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: ${props => props.theme.spacing[30]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  resize: vertical;
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props => props.theme.spacing[0.75]} ${props => props.theme.colors.primary[100]};
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
  font-family: ${props => props.theme.typography.fontFamily.primary};
  ${props => props.theme.hoverTransition()};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 ${props => props.theme.spacing[0.75]} ${props => props.theme.colors.primary[100]};
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  background: ${props => props.theme.colors.primary[500]};
  border: none;
  color: ${props => props.theme.colors.hero?.text || props.theme.colors.neutral[0]};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  padding: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.base};
  
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.lg};
    background: ${props => props.theme.colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  &:active {
    transform: translateY(0);
  }
`

const SuccessCard = styled(Card)`
  max-width: ${props => props.theme.spacing[125]};
  margin: 0 auto;
  text-align: center;
  padding: ${props => props.theme.spacing[12]};
`

const SuccessIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const SuccessTitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
`

const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[8]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const SuccessButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
`

interface FeedbackData {
  name: string
  email: string
  category: string
  subject: string
  message: string
}

/**
 * FeedbackOverlay Component
 * Modal overlay for feedback form (T1: Refactor to Modal)
 * Replaces FeedbackPage to prevent context loss during navigation
 */
export function FeedbackOverlay() {
  const { t } = useTranslation()
  const { isOpen, closeModal } = useFeedbackModalStore()
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Initialize EmailJS service
  useEffect(() => {
    if (isOpen) {
      initEmailService()
    }
  }, [isOpen])

  // Esc key handler (R1: A11y Dismissal)
  useEffect(() => {
    if (!isOpen) return

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, closeModal])

  // Focus trap: Focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      const firstInput = modalContentRef.current.querySelector('input, textarea, select, button') as HTMLElement
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }, [isOpen])

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
      const response = await sendFeedbackEmail(formData)
      
      if (response.success) {
        setIsSubmitted(true)
        
        // Reset form
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

  const handleClose = () => {
    setIsSubmitted(false)
    setFormData({
      name: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    })
    closeModal()
  }

  const handleNewFeedback = () => {
    setIsSubmitted(false)
  }

  const categories = [
    'general',
    'technical',
    'design',
    'collaboration',
    'bug',
    'other'
  ]

  if (!isOpen) return null

  return (
    <FeedbackModalOverlay
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <FeedbackModalContent
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <FeedbackModalCloseButton
          onClick={handleClose}
          aria-label={t('feedback.modal.close', 'Close feedback modal')}
        >
          <CloseIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </CloseIcon>
        </FeedbackModalCloseButton>

        {isSubmitted ? (
          <SuccessCard>
            <SuccessIconContainer>
              <CheckMarkIcon size={64} />
            </SuccessIconContainer>
            <SuccessTitle>{t('feedback.success.title')}</SuccessTitle>
            <SuccessMessage>
              {t('feedback.success.message')}
            </SuccessMessage>
            <SuccessButtonGroup>
              <Button onClick={handleNewFeedback} variant="outline">
                {t('feedback.success.newFeedback')}
              </Button>
              <Button onClick={handleClose} variant="primary">
                {t('feedback.success.close', 'Close')}
              </Button>
            </SuccessButtonGroup>
          </SuccessCard>
        ) : (
          <>
            <FeedbackHeader>
              <Title id="feedback-modal-title">{t('feedback.title')}</Title>
              <Subtitle>
                {t('feedback.subtitle')}
              </Subtitle>
            </FeedbackHeader>

            <FeedbackForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="feedback-name">
                  {t('feedback.form.name')} *
                </Label>
                <Input
                  type="text"
                  id="feedback-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('feedback.form.placeholder.name')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="feedback-email">
                  {t('feedback.form.email')} *
                </Label>
                <Input
                  type="email"
                  id="feedback-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('feedback.form.placeholder.email')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="feedback-category">
                  {t('feedback.form.category')}
                </Label>
                <Select
                  id="feedback-category"
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
                <Label htmlFor="feedback-subject">
                  {t('feedback.form.subject')} *
                </Label>
                <Input
                  type="text"
                  id="feedback-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={t('feedback.form.placeholder.subject')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="feedback-message">
                  {t('feedback.form.message')} *
                </Label>
                <TextArea
                  id="feedback-message"
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
          </>
        )}
      </FeedbackModalContent>
    </FeedbackModalOverlay>
  )
}

