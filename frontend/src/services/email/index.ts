// 이메일 서비스 메인 인덱스
export * from './emailService'
export * from './types'
export * from './templates'

// 기본 export
export { 
  sendFeedbackEmail, 
  initEmailService, 
  testEmailConnection,
  getEmailConfigStatus 
} from './emailService'
