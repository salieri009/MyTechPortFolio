import { create } from 'zustand'

interface FiltersState {
  techStacks: string[]
  year?: number
  sort: 'endDate,desc' | 'endDate,asc'
  setTechStacks: (techStacks: string[]) => void
  setYear: (year?: number) => void
  setSort: (sort: 'endDate,desc' | 'endDate,asc') => void
  clearFilters: () => void
}

export const useFilters = create<FiltersState>((set) => ({
  techStacks: [],
  year: undefined,
  sort: 'endDate,desc',
  setTechStacks: (techStacks) => set({ techStacks }),
  setYear: (year) => set({ year }),
  setSort: (sort) => set({ sort }),
  clearFilters: () => set({ techStacks: [], year: undefined, sort: 'endDate,desc' }),
}))
