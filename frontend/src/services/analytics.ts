// Google Analytics 4 연동 서비스
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  userRole?: string;
  customParameters?: Record<string, any>;
}

export interface UserAnalyticsContext {
  userId?: string;
  email?: string;
  role?: string;
  isAuthenticated: boolean;
  registrationSource?: string;
  sessionId?: string;
}

class AnalyticsService {
  private readonly GA_MEASUREMENT_ID: string;
  private isInitialized = false;
  private userContext: UserAnalyticsContext = { isAuthenticated: false };

  constructor() {
    this.GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  }

  // Safe accessor for gtag to satisfy TypeScript when gtag might be undefined
  private getGtag(): (...args: any[]) => void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      return window.gtag as (...args: any[]) => void;
    }
    return () => {};
  }

  // GA4 초기화
  async init(): Promise<void> {
    if (!this.GA_MEASUREMENT_ID) {
      console.warn('GA_MEASUREMENT_ID가 설정되지 않았습니다.');
      return;
    }

    try {
      // Google Analytics 스크립트 로드
      await this.loadGoogleAnalytics();
      
      // 기본 설정
      this.getGtag()('config', this.GA_MEASUREMENT_ID, {
        page_title: 'MyPortfolio',
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'user_role',
          custom_parameter_2: 'project_category'
        }
      });

      this.isInitialized = true;
      console.log('Google Analytics 4 초기화 완료');
    } catch (error) {
      console.error('Google Analytics 초기화 실패:', error);
    }
  }

  // Google Analytics 스크립트 동적 로드
  private loadGoogleAnalytics(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.gtag === 'function') {
        resolve();
        return;
      }

      // dataLayer 초기화
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // 스크립트 태그 생성
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
      
      script.onload = () => {
        this.getGtag()('js', new Date());
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Google Analytics 스크립트 로드 실패'));
      };

      document.head.appendChild(script);
    });
  }

  // 사용자 컨텍스트 설정
  setUserContext(context: UserAnalyticsContext): void {
    this.userContext = { ...context };
    
    if (this.isInitialized && context.userId) {
      this.getGtag()('config', this.GA_MEASUREMENT_ID, {
        user_id: context.userId,
        custom_parameter_1: context.role || 'anonymous'
      });
    }
  }

  // 페이지 뷰 추적
  trackPageView(pagePath: string, pageTitle?: string): void {
    if (!this.isInitialized) return;

    const enrichedParams = {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      user_role: this.userContext.role || 'anonymous',
      user_type: this.userContext.isAuthenticated ? 'authenticated' : 'anonymous'
    };

    this.getGtag()('event', 'page_view', enrichedParams);
  }

  // 프로젝트 조회 추적
  trackProjectView(projectId: number, projectTitle: string, techStacks: string[]): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'project_view', {
      project_id: projectId,
      project_title: projectTitle,
      tech_stacks: techStacks.join(','),
      content_type: 'project',
      user_role: this.userContext.role || 'anonymous',
      engagement_time_msec: Date.now()
    });
  }

  // 학업 정보 조회 추적
  trackAcademicView(academicId: number, subjectName: string, semester: string): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'academic_view', {
      academic_id: academicId,
      subject_name: subjectName,
      semester: semester,
      content_type: 'academic',
      user_role: this.userContext.role || 'anonymous'
    });
  }

  // 로그인 추적
  trackLogin(method: 'google' | 'email' | 'github', success: boolean): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'login', {
      method,
      success: success ? 'true' : 'false',
      timestamp: new Date().toISOString()
    });
  }

  // 파일 다운로드 추적
  trackDownload(fileName: string, fileType: 'resume' | 'portfolio' | 'document'): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'file_download', {
      file_name: fileName,
      file_extension: fileName.split('.').pop(),
      file_type: fileType,
      user_role: this.userContext.role || 'anonymous'
    });
  }

  // 연락처 클릭 추적
  trackContactClick(contactType: 'email' | 'linkedin' | 'github' | 'phone'): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'contact_click', {
      contact_type: contactType,
      user_role: this.userContext.role || 'anonymous',
      page_location: window.location.href
    });
  }

  // 검색 추적
  trackSearch(searchTerm: string, category: 'projects' | 'academics' | 'techstacks'): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'search', {
      search_term: searchTerm,
      search_category: category,
      user_role: this.userContext.role || 'anonymous'
    });
  }

  // 필터 사용 추적
  trackFilterUsage(filterType: string, filterValue: string, resultCount: number): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'filter_usage', {
      filter_type: filterType,
      filter_value: filterValue,
      result_count: resultCount,
      user_role: this.userContext.role || 'anonymous'
    });
  }

  // 사용자 참여도 추적
  trackEngagement(eventType: 'scroll' | 'click' | 'hover' | 'focus', element: string): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'user_engagement', {
      engagement_type: eventType,
      element_name: element,
      user_role: this.userContext.role || 'anonymous',
      timestamp: Date.now()
    });
  }

  // 사용자 정의 이벤트 추적
  trackCustomEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    const enrichedParams = {
      ...event.customParameters,
      category: event.category || 'general',
      label: event.label,
      value: event.value,
      user_id: event.userId || this.userContext.userId,
      user_role: event.userRole || this.userContext.role || 'anonymous'
    };

    this.getGtag()('event', event.action, enrichedParams);
  }

  // 오류 추적
  trackError(errorMessage: string, errorType: 'javascript' | 'api' | 'auth' | 'network'): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'exception', {
      description: errorMessage,
      error_type: errorType,
      fatal: false,
      user_role: this.userContext.role || 'anonymous',
      page_location: window.location.href
    });
  }

  // 성능 추적
  trackPerformance(metricName: string, value: number, unit: 'ms' | 'bytes' | 'count'): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'timing_complete', {
      name: metricName,
      value: value,
      unit: unit,
      user_role: this.userContext.role || 'anonymous'
    });
  }

  // 사용자 플로우 추적
  trackUserFlow(step: string, flowName: string, completed: boolean): void {
    if (!this.isInitialized) return;

    this.getGtag()('event', 'user_flow', {
      step_name: step,
      flow_name: flowName,
      completed: completed ? 'true' : 'false',
      user_role: this.userContext.role || 'anonymous'
    });
  }
}

// 싱글톤 인스턴스
export const analyticsService = new AnalyticsService();

// React Hook용 간편 함수들
export const analytics = {
  init: () => analyticsService.init(),
  setUser: (context: UserAnalyticsContext) => analyticsService.setUserContext(context),
  pageView: (path: string, title?: string) => analyticsService.trackPageView(path, title),
  projectView: (id: number, title: string, techStacks: string[]) => 
    analyticsService.trackProjectView(id, title, techStacks),
  academicView: (id: number, name: string, semester: string) => 
    analyticsService.trackAcademicView(id, name, semester),
  login: (method: 'google' | 'email' | 'github', success: boolean) => 
    analyticsService.trackLogin(method, success),
  download: (fileName: string, type: 'resume' | 'portfolio' | 'document') => 
    analyticsService.trackDownload(fileName, type),
  contactClick: (type: 'email' | 'linkedin' | 'github' | 'phone') => 
    analyticsService.trackContactClick(type),
  search: (term: string, category: 'projects' | 'academics' | 'techstacks') => 
    analyticsService.trackSearch(term, category),
  filter: (type: string, value: string, count: number) => 
    analyticsService.trackFilterUsage(type, value, count),
  engagement: (type: 'scroll' | 'click' | 'hover' | 'focus', element: string) => 
    analyticsService.trackEngagement(type, element),
  error: (message: string, type: 'javascript' | 'api' | 'auth' | 'network') => 
    analyticsService.trackError(message, type),
  performance: (metric: string, value: number, unit: 'ms' | 'bytes' | 'count') => 
    analyticsService.trackPerformance(metric, value, unit),
  customEvent: (event: AnalyticsEvent) => analyticsService.trackCustomEvent(event)
};
