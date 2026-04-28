import { create } from 'zustand'

interface PaginationMeta {
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface FilterState {
  searchTerm: string
  selectedTechStacks: string[]
  techStacks: string[]
  year: number | null
  sort: string
  isLoading: boolean
  isFiltering: boolean
  isInitialLoad: boolean
  currentPage: number
  pageSize: number
  pagination: PaginationMeta | null
  filterCounts: Record<string, number>
  setSearchTerm: (term: string) => void
  setSelectedTechStacks: (stacks: string[]) => void
  setTechStacks: (stacks: string[]) => void
  setYear: (year: number | null) => void
  setSort: (sort: string) => void
  addTechStack: (stack: string) => void
  removeTechStack: (stack: string) => void
  clearFilters: () => void
  setLoading: (loading: boolean) => void
  setFiltering: (filtering: boolean) => void
  setInitialLoad: (isInitial: boolean) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilterCounts: (counts: Record<string, number>) => void
  resetFilters: () => void
}

export const useFilters = create<FilterState>((set) => ({
  searchTerm: '',
  selectedTechStacks: [],
  techStacks: [],
  year: null,
  sort: 'endDate,desc',
  isLoading: true,
  isFiltering: false,
  isInitialLoad: true,
  currentPage: 1,
  pageSize: 20,
  pagination: null,
  filterCounts: {},
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTechStacks: (stacks) => set({ selectedTechStacks: stacks }),
  setTechStacks: (stacks) => set({ techStacks: stacks }),
  setYear: (year) => set({ year }),
  setSort: (sort) => set({ sort }),
  addTechStack: (stack) => set((state) => ({
    selectedTechStacks: [...state.selectedTechStacks, stack]
  })),
  removeTechStack: (stack) => set((state) => ({
    selectedTechStacks: state.selectedTechStacks.filter((s) => s !== stack)
  })),
  clearFilters: () => set({
    searchTerm: '',
    selectedTechStacks: [],
    techStacks: [],
    year: null,
    sort: 'endDate,desc',
    currentPage: 1
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  setFiltering: (filtering) => set({ isFiltering: filtering }),
  setInitialLoad: (isInitial) => set({ isInitialLoad: isInitial }),
  setPagination: (pagination) => set({ pagination }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setFilterCounts: (counts) => set({ filterCounts: counts }),
  resetFilters: () => set({
    searchTerm: '',
    selectedTechStacks: [],
    techStacks: [],
    year: null,
    sort: 'endDate,desc',
    currentPage: 1,
    pagination: null
  })
}))
