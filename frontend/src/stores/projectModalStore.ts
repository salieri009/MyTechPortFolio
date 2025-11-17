import { create } from 'zustand'

interface ProjectModalState {
  selectedProjectId: number | null
  triggerElementRef: HTMLElement | null
  openModal: (projectId: number, triggerElement?: HTMLElement | null) => void
  closeModal: () => void
}

/**
 * Project Modal Store
 * Global state management for project detail modal overlay
 * Supports focus return to trigger element (R3: A11y Focus Return)
 */
export const useProjectModalStore = create<ProjectModalState>((set) => ({
  selectedProjectId: null,
  triggerElementRef: null,
  openModal: (projectId: number, triggerElement = null) => {
    // Save scroll position
    const scrollPosition = window.scrollY
    sessionStorage.setItem('projectModalScrollPosition', String(scrollPosition))
    
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    
    set({
      selectedProjectId: projectId,
      triggerElementRef: triggerElement
    })
  },
  closeModal: () => {
    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem('projectModalScrollPosition')
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10))
      sessionStorage.removeItem('projectModalScrollPosition')
    }
    
    // Restore body scroll
    document.body.style.overflow = ''
    
    // Return focus to trigger element (R3)
    const state = useProjectModalStore.getState()
    if (state.triggerElementRef) {
      setTimeout(() => {
        state.triggerElementRef?.focus()
      }, 100)
    }
    
    set({
      selectedProjectId: null,
      triggerElementRef: null
    })
  }
}))

