import { create } from 'zustand'

interface FilterState {
  searchTerm: string
  selectedTechStacks: string[]
  techStacks: string[]
  year: number | null
  sort: string
  setSearchTerm: (term: string) => void
  setSelectedTechStacks: (stacks: string[]) => void
  setTechStacks: (stacks: string[]) => void
  setYear: (year: number | null) => void
  setSort: (sort: string) => void
  addTechStack: (stack: string) => void
  removeTechStack: (stack: string) => void
  clearFilters: () => void
}

export const useFilters = create<FilterState>((set) => ({
  searchTerm: '',
  selectedTechStacks: [],
  techStacks: [],
  year: null,
  sort: 'endDate,desc',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTechStacks: (stacks) => set({ selectedTechStacks: stacks }),
  setTechStacks: (stacks) => set({ techStacks: stacks }),
  setYear: (year) => set({ year }),
  setSort: (sort) => set({ sort }),
  addTechStack: (stack) => set((state) => ({ 
    selectedTechStacks: [...state.selectedTechStacks, stack] 
  })),
  removeTechStack: (stack) => set((state) => ({ 
    selectedTechStacks: state.selectedTechStacks.filter(s => s !== stack) 
  })),
  clearFilters: () => set({ searchTerm: '', selectedTechStacks: [], year: null, sort: 'endDate,desc' }),
}))
