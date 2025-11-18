import { Button } from '../ui/Button'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.75); /* neutral-900 with opacity */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1400; /* modal z-index */
  animation: fadeIn 200ms ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContent = styled.div`
  background: #FFFFFF; /* neutral-0 */
  border-radius: ${props => props.theme.borderRadius.lg || '12px'};
  padding: ${props => props.theme.spacing[6]};
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  animation: slideUp 200ms ease-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const ModalTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: #111827; /* neutral-900 */
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`

const ModalMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: #6B7280; /* neutral-500 */
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  line-height: 1.5;
`

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: flex-end;
`

const CancelButton = styled(Button)`
  background: #FFFFFF; /* neutral-0 */
  color: #6B7280; /* neutral-500 */
  border: 1px solid #E5E7EB; /* neutral-200 */
  
  &:hover {
    background: #F9FAFB; /* neutral-50 equivalent */
    color: #111827; /* neutral-900 */
    border-color: #E5E7EB; /* neutral-200 */
  }
  
  transition: all 200ms ease;
`

const ConfirmButton = styled(Button)`
  background: #EF4444; /* error-500 */
  color: #FFFFFF;
  border: none;
  
  &:hover {
    background: #DC2626; /* error-500 darker */
  }
  
  &:disabled {
    background: #FCA5A5; /* error-500 lighter */
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  transition: all 200ms ease;
`

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  requireExplicitConfirm?: boolean
}

/**
 * Confirmation Modal Component
 * Implements H5: Error Prevention - Prevents accidental destructive actions
 */
export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  requireExplicitConfirm = false
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalActions>
          <CancelButton variant="secondary" onClick={onCancel}>
            {cancelText}
          </CancelButton>
          <ConfirmButton
            variant="danger"
            onClick={onConfirm}
            disabled={requireExplicitConfirm}
          >
            {confirmText}
          </ConfirmButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  )
}

