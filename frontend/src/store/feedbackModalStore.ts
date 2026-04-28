import { create } from 'zustand'

interface FeedbackModalState {
  isOpen: boolean
  triggerElementRef: HTMLElement | null
  openModal: (triggerElement?: HTMLElement | null) => void
  closeModal: () => void
}

export const useFeedbackModalStore = create<FeedbackModalState>((set) => ({
  isOpen: false,
  triggerElementRef: null,
  openModal: (triggerElement = null) => {
    const scrollPosition = window.scrollY
    sessionStorage.setItem('feedbackModalScrollPosition', String(scrollPosition))
    document.body.style.overflow = 'hidden'

    set({
      isOpen: true,
      triggerElementRef: triggerElement
    })
  },
  closeModal: () => {
    const savedScrollPosition = sessionStorage.getItem('feedbackModalScrollPosition')
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10))
      sessionStorage.removeItem('feedbackModalScrollPosition')
    }

    document.body.style.overflow = ''

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
