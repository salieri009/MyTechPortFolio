export type TechType = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DEVOPS' | 'MOBILE' | 'AI_ML' | 'CLOUD' | 'TESTING' | 'OTHER'
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface ProjectSummary {
  id: string  // MongoDB ObjectId
  title: string
  summary: string
  startDate: string // YYYY-MM-DD (LocalDate)
  endDate: string   // YYYY-MM-DD (LocalDate)
  techStacks: string[]
  imageUrl?: string
  featured?: boolean
}

export interface ProjectDetail extends ProjectSummary {
  description: string // markdown
  githubUrl?: string
  demoUrl?: string
  relatedAcademics?: string[]
  // Note: challenge, solution, keyOutcomes not in backend - use for future expansion
}

export interface Academic {
  id: string  // MongoDB ObjectId
  name: string
  semester: string
  grade?: string
  description?: string
  relatedProjects?: RelatedProject[]
  // Frontend-specific fields (not in backend)
  creditPoints?: number
  marks?: number
  status?: 'completed' | 'enrolled' | 'exemption'
}

export interface RelatedProject {
  id: string
  title: string
}

export interface TechStack {
  id: string  // MongoDB ObjectId
  name: string
  type: TechType
  proficiencyLevel?: ProficiencyLevel
  proficiencyLevelValue?: number // 1-4 for sorting
  proficiencyDisplay?: string // "중급 (Lv.2)"
  usageCount?: number
  isPrimary?: boolean
  logoUrl?: string
  officialUrl?: string
  description?: string
}

export interface Testimonial {
  id: string
  authorName: string
  authorTitle?: string
  authorCompany?: string
  authorLinkedInUrl?: string
  content: string
  rating?: number // 1-5
  type: TestimonialType
  source?: TestimonialSource
  isFeatured?: boolean
  displayOrder?: number
  projectId?: string
  testimonialDate?: string
  createdAt?: string
  updatedAt?: string
}

export type TestimonialType = 'CLIENT' | 'COLLEAGUE' | 'MENTOR' | 'PROFESSOR' | 'OTHER'
export type TestimonialSource = 'MANUAL' | 'LINKEDIN' | 'GITHUB' | 'EMAIL' | 'OTHER'

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
  rating?: number // 1-5
  type: TestimonialType
  source?: TestimonialSource
  isFeatured?: boolean
  displayOrder?: number
  projectId?: string
}

export interface TechStackCreateRequest {
  name: string
  type: TechType
  proficiencyLevel?: ProficiencyLevel
  isPrimary?: boolean
  logoUrl?: string
  officialUrl?: string
  description?: string
}

export interface ContactRequest {
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
  company?: string
}