import { create } from 'zustand'

interface PaginationMeta {
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface FilterState {
  // Filter values
  searchTerm: string
  selectedTechStacks: string[]
  techStacks: string[]
  year: number | null
  sort: string
  
  // Loading states (세분화)
  isLoading: boolean           // 초기 로딩
  isFiltering: boolean         // 필터링 중 (서버 요청)
  isInitialLoad: boolean       // 첫 로드 여부
  
  // Pagination state
  currentPage: number
  pageSize: number
  pagination: PaginationMeta | null
  
  // Filter metadata (UX 개선용)
  filterCounts: Record<string, number>  // { "React": 15, "TypeScript": 23 }
  
  // Actions
  setSearchTerm: (term: string) => void
  setSelectedTechStacks: (stacks: string[]) => void
  setTechStacks: (stacks: string[]) => void
  setYear: (year: number | null) => void
  setSort: (sort: string) => void
  addTechStack: (stack: string) => void
  removeTechStack: (stack: string) => void
  clearFilters: () => void
  
  // New actions for server-side filtering
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
  // Filter values
  searchTerm: '',
  selectedTechStacks: [],
  techStacks: [],
  year: null,
  sort: 'endDate,desc',
  
  // Loading states
  isLoading: true,
  isFiltering: false,
  isInitialLoad: true,
  
  // Pagination
  currentPage: 1,
  pageSize: 20,  // 서버사이드 필터링: 페이지당 20개
  pagination: null,
  
  // Filter metadata
  filterCounts: {},
  
  // Filter actions
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
  clearFilters: () => set({ 
    searchTerm: '', 
    selectedTechStacks: [], 
    techStacks: [],
    year: null, 
    sort: 'endDate,desc',
    currentPage: 1
  }),
  
  // New actions for server-side filtering
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
  }),
}))
