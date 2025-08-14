// 이메일 서비스 타입 정의
export interface FeedbackData {
  name: string
  email: string
  category: string
  subject: string
  message: string
}

export interface EmailConfig {
  serviceId: string
  templateId: string
  publicKey: string
  toEmail: string
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
  data?: any
}

export interface EmailTemplate {
  html: string
  plain: string
}

export interface EmailTemplateData extends FeedbackData {
  timestamp: string
  websiteUrl: string
  websiteName: string
}

export type CategoryType = 'general' | 'technical' | 'design' | 'collaboration' | 'bug' | 'other'

export interface CategoryInfo {
  key: CategoryType
  label: string
  emoji: string
  color: string
}
