export type TechType = 'Backend' | 'Frontend' | 'DB' | 'DevOps' | 'Other'

export interface ProjectSummary {
  id: number
  title: string
  summary: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  techStacks: string[]
  imageUrl?: string
  featured?: boolean
}

export interface ProjectDetail extends ProjectSummary {
  description: string // markdown
  githubUrl?: string
  demoUrl?: string
  relatedAcademics?: string[]
  challenge?: string
  solution?: string[]
  keyOutcomes?: string[]
}

export interface Academic {
  id: number
  name: string
  semester: string
  grade?: string
  description?: string
  creditPoints?: number
  marks?: number
  status: 'completed' | 'enrolled' | 'exemption'
}

export interface TechStack {
  id: number
  name: string
  type: TechType
}

// Request DTOs for CRUD operations
export interface ProjectCreateRequest {
  title: string
  summary: string
  description: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  githubUrl?: string
  demoUrl?: string
  techStackIds: string[] // MongoDB ObjectIds
  academicIds?: string[] // MongoDB ObjectIds
}

export interface ProjectUpdateRequest {
  title: string
  summary: string
  description: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  githubUrl?: string
  demoUrl?: string
  techStackIds: string[] // MongoDB ObjectIds
  academicIds?: string[] // MongoDB ObjectIds
}

export interface AcademicCreateRequest {
  name: string
  semester: string
  grade?: string
  description?: string
}

export interface AcademicUpdateRequest {
  name: string
  semester: string
  grade?: string
  description?: string
}

export interface TestimonialCreateRequest {
  authorName: string
  authorTitle?: string
  authorCompany?: string
  authorEmail?: string
  authorLinkedInUrl?: string
  content: string
  rating: number // 1-5
  type: 'CLIENT' | 'COLLEAGUE' | 'MENTOR' | 'PROFESSOR' | 'OTHER'
  source?: 'MANUAL' | 'LINKEDIN' | 'GITHUB'
  isFeatured?: boolean
  displayOrder?: number
  projectId?: string
}