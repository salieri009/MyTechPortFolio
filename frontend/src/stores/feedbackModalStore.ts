import { create } from 'zustand'

interface FeedbackModalState {
  isOpen: boolean
  triggerElementRef: HTMLElement | null
  openModal: (triggerElement?: HTMLElement | null) => void
  closeModal: () => void
}

/**
 * Feedback Modal Store
 * Global state management for feedback modal overlay
 * Supports focus return to trigger element (R2: A11y Focus Return)
 */
export const useFeedbackModalStore = create<FeedbackModalState>((set) => ({
  isOpen: false,
  triggerElementRef: null,
  openModal: (triggerElement = null) => {
    // Save scroll position
    const scrollPosition = window.scrollY
    sessionStorage.setItem('feedbackModalScrollPosition', String(scrollPosition))
    
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    
    set({
      isOpen: true,
      triggerElementRef: triggerElement
    })
  },
  closeModal: () => {
    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem('feedbackModalScrollPosition')
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10))
      sessionStorage.removeItem('feedbackModalScrollPosition')
    }
    
    // Restore body scroll
    document.body.style.overflow = ''
    
    // Return focus to trigger element (R2)
    const state = useFeedbackModalStore.getState()
    if (state.triggerElementRef) {
      setTimeout(() => {
        state.triggerElementRef?.focus()
      }, 100)
    }
    
    set({
      isOpen: false,
      triggerElementRef: null
    })
  }
}))

