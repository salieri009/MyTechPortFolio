export class SecurityMonitor {
  private static instance: SecurityMonitor
  private anomalyCount = 0
  private lastReportTime = 0
  private readonly REPORT_INTERVAL = 60000 // 1 minute

  static getInstance(): SecurityMonitor {
    if (!this.instance) {
      this.instance = new SecurityMonitor()
    }
    return this.instance
  }

  init() {
    this.setupGlobalErrorHandler()
    this.setupCSPViolationHandler()
    this.setupPerformanceMonitoring()
    this.setupDevToolsDetection()
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      // Check for potential security-related errors
      if (this.isSecurityRelatedError(event.error)) {
        this.reportSecurityEvent('script_error', {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno
        })
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      if (this.isSecurityRelatedError(event.reason)) {
        this.reportSecurityEvent('promise_rejection', {
          reason: event.reason?.message || 'Unknown rejection'
        })
      }
    })
  }

  private setupCSPViolationHandler() {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.reportSecurityEvent('csp_violation', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition
      })
    })
  }

  private setupPerformanceMonitoring() {
    // Monitor for potential DoS attacks through excessive resource usage
    setInterval(() => {
      // Check if performance.memory exists (Chrome-specific)
      if ('memory' in performance) {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB threshold
          this.reportSecurityEvent('high_memory_usage', {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize
          })
        }
      }
    }, 30000) // Check every 30 seconds
  }

  private setupDevToolsDetection() {
    let devtools = false
    const element = new Image()
    Object.defineProperty(element, 'id', {
      get: () => {
        devtools = true
        this.reportSecurityEvent('devtools_opened', {
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }
    })
    
    setInterval(() => {
      devtools = false
      console.log(element)
      console.clear()
    }, 1000)
  }

  private isSecurityRelatedError(error: any): boolean {
    if (!error) return false
    
    const securityKeywords = [
      'script', 'eval', 'inject', 'xss', 'csrf', 
      'unauthorized', 'forbidden', 'cors'
    ]
    
    const errorMessage = error.message?.toLowerCase() || ''
    return securityKeywords.some(keyword => errorMessage.includes(keyword))
  }

  private async reportSecurityEvent(type: string, data: any) {
    this.anomalyCount++
    
    // Rate limiting for reports
    const now = Date.now()
    if (now - this.lastReportTime < this.REPORT_INTERVAL) {
      return
    }
    
    this.lastReportTime = now
    
    try {
      // In development, just log to console
      if (import.meta.env.DEV) {
        console.warn('Security Event:', { type, data, anomalyCount: this.anomalyCount })
        return
      }

      // In production, send to backend
      await fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data,
          anomalyCount: this.anomalyCount,
          timestamp: now,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      console.warn('Failed to report security event:', error)
    }
  }

  // Manual reporting method for application-specific events
  reportCustomEvent(type: string, data: any) {
    this.reportSecurityEvent(`custom_${type}`, data)
  }
}

// Initialize security monitoring
export const securityMonitor = SecurityMonitor.getInstance()
