import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

/**
 * Confirmation Dialog Component
 * Nielsen Heuristic #3: User Control and Freedom
 * Nielsen Heuristic #5: Error Prevention
 * Prevents accidental destructive actions
 */

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: ${props => props.theme.spacing[4]};
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const Dialog = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 500px;
  width: 100%;
  padding: ${props => props.theme.spacing[6]};
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const DialogTitle = styled.h2`
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
`

const DialogMessage = styled.p`
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const DialogActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: flex-end;
`

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus cancel button when dialog opens
      cancelButtonRef.current?.focus()
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onCancel])
  
  if (!isOpen) return null
  
  return (
    <Overlay onClick={onCancel}>
      <Dialog 
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogMessage id="dialog-message">{message}</DialogMessage>
        <DialogActions>
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Overlay>
  )
}

