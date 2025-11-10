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
