import { create } from 'zustand'

interface ProjectModalState {
  selectedProjectId: number | null
  triggerElementRef: HTMLElement | null
  openModal: (projectId: number, triggerElement?: HTMLElement | null) => void
  closeModal: () => void
}

export const useProjectModalStore = create<ProjectModalState>((set) => ({
  selectedProjectId: null,
  triggerElementRef: null,
  openModal: (projectId: number, triggerElement = null) => {
    const scrollPosition = window.scrollY
    sessionStorage.setItem('projectModalScrollPosition', String(scrollPosition))
    document.body.style.overflow = 'hidden'

    set({
      selectedProjectId: projectId,
      triggerElementRef: triggerElement
    })
  },
  closeModal: () => {
    const savedScrollPosition = sessionStorage.getItem('projectModalScrollPosition')
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10))
      sessionStorage.removeItem('projectModalScrollPosition')
    }

    document.body.style.overflow = ''

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
