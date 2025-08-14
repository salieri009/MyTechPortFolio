// 이메일 전송 서비스 (EmailJS 래퍼)
import emailjs from '@emailjs/browser'
import { EmailTemplate, EmailResponse, EmailConfig, FeedbackData } from './types'
import { buildEmailTemplate } from './templates'
import { analytics } from '../analytics'

class EmailService {
  private config: EmailConfig
  private isInitialized = false

  constructor() {
    this.config = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
      toEmail: import.meta.env.VITE_FEEDBACK_EMAIL || 'your.email@example.com'
    }
  }

  async init(): Promise<void> {
    if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
      console.warn('EmailJS configuration is incomplete. Please check your environment variables.')
      console.warn('Required variables: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY')
      return
    }

    try {
      emailjs.init(this.config.publicKey)
      this.isInitialized = true
      console.log('EmailJS initialized successfully')
    } catch (error) {
      console.error('EmailJS initialization failed:', error)
    }
  }

  async sendFeedback(feedbackData: FeedbackData): Promise<EmailResponse> {
    if (!this.isInitialized) {
      await this.init()
    }

    if (!this.isInitialized) {
      return {
        success: false,
        error: 'EmailJS not properly configured. Please check your environment variables.'
      }
    }

    try {
      // 이메일 템플릿 생성 (미래지향적 디자인)
      const emailTemplate = buildEmailTemplate(feedbackData)
      
      const templateParams = {
        to_email: this.config.toEmail,
        from_name: feedbackData.name,
        from_email: feedbackData.email,
        subject: `[포트폴리오 피드백] ${feedbackData.subject}`,
        html_content: emailTemplate.html,
        plain_content: emailTemplate.plain,
        category: feedbackData.category,
        message: feedbackData.message,
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // 웹사이트 브랜딩
        website_url: typeof window !== 'undefined' ? window.location.origin : 'https://yourportfolio.com',
        website_name: 'MyTech Portfolio'
      }

      console.log('Sending email with EmailJS...', {
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        from: feedbackData.email,
        category: feedbackData.category
      })

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      )

      // Analytics 추적
      analytics.contactClick('email')
      analytics.customEvent({
        action: 'feedback_sent',
        category: feedbackData.category,
        label: 'emailjs',
        customParameters: {
          feedback_type: feedbackData.category,
          success: true,
          email_service: 'emailjs'
        }
      })

      console.log('Feedback sent successfully:', response)
      
      return {
        success: true,
        messageId: response.text,
        data: response
      }

    } catch (error) {
      console.error('Failed to send feedback:', error)
      
      // Analytics 에러 추적
      analytics.error('feedback_send_failed', 'api')
      analytics.customEvent({
        action: 'feedback_error',
        category: 'email',
        label: 'emailjs_error',
        customParameters: {
          error_type: error instanceof Error ? error.name : 'unknown',
          error_message: error instanceof Error ? error.message : 'unknown error'
        }
      })
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // 설정 상태 확인
  getConfigStatus(): { configured: boolean; missing: string[] } {
    const required = ['serviceId', 'templateId', 'publicKey']
    const missing = required.filter(key => !this.config[key as keyof EmailConfig])
    
    return {
      configured: missing.length === 0,
      missing
    }
  }

  // 테스트 이메일 전송
  async sendTestEmail(): Promise<EmailResponse> {
    const testData: FeedbackData = {
      name: 'Test User',
      email: 'test@example.com',
      category: 'technical',
      subject: 'EmailJS 연결 테스트',
      message: '이 메시지는 EmailJS 설정이 올바르게 작동하는지 확인하기 위한 테스트입니다.\n\n만약 이 메시지를 받으셨다면, 이메일 시스템이 정상적으로 작동하고 있습니다!'
    }

    console.log('Sending test email...')
    const result = await this.sendFeedback(testData)
    
    if (result.success) {
      console.log('✅ Test email sent successfully!')
    } else {
      console.error('❌ Test email failed:', result.error)
    }
    
    return result
  }
}

// 싱글톤 인스턴스
export const emailService = new EmailService()

// 편의 함수들
export const sendFeedbackEmail = (data: FeedbackData) => emailService.sendFeedback(data)
export const initEmailService = () => emailService.init()
export const testEmailConnection = () => emailService.sendTestEmail()
export const getEmailConfigStatus = () => emailService.getConfigStatus()

// 개발 환경에서 설정 상태 체크
if (import.meta.env.DEV) {
  const status = emailService.getConfigStatus()
  if (!status.configured) {
    console.warn('🚨 EmailJS Configuration Missing:', status.missing)
    console.warn('Please add these environment variables to your .env file:')
    status.missing.forEach(key => {
      const envName = `VITE_EMAILJS_${key.toUpperCase().replace('KEY', 'KEY')}`
      console.warn(`- ${envName}`)
    })
  }
}
