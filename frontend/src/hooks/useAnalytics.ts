import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { analytics, UserAnalyticsContext } from '../services/analytics';

// Analytics Hook - 사용자 컨텍스트와 함께 이벤트 추적
export function useAnalytics() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // 사용자 컨텍스트 설정
  useEffect(() => {
    const userContext: UserAnalyticsContext = {
      userId: user?.id?.toString(),
      email: user?.email,
      role: user?.roles?.[0] || user?.role || 'anonymous',
      isAuthenticated,
      registrationSource: user?.registrationSource,
      sessionId: user?.sessionId
    };

    analytics.setUser(userContext);
  }, [user, isAuthenticated]);

  // 페이지 변경 시 자동 추적
  useEffect(() => {
    const pageTitle = document.title;
    analytics.pageView(location.pathname, pageTitle);
  }, [location]);

  // 사용자 컨텍스트와 함께 이벤트 추적하는 함수들
  const trackWithUserContext = useCallback((eventName: string, parameters: any) => {
    analytics.customEvent({
      action: eventName,
      userId: user?.id?.toString(),
      userRole: user?.roles?.[0] || user?.role || 'anonymous',
      customParameters: {
        ...parameters,
        timestamp: new Date().toISOString(),
        page_location: window.location.href
      }
    });
  }, [user]);

  return {
    // 기본 analytics 함수들
    ...analytics,
    
    // 사용자 컨텍스트와 함께 추적
    trackWithUserContext,
    
    // 특화된 추적 함수들
    trackProjectInteraction: useCallback((projectId: number, action: string, details?: any) => {
      trackWithUserContext('project_interaction', {
        project_id: projectId,
        interaction_type: action,
        ...details
      });
    }, [trackWithUserContext]),

    trackNavigation: useCallback((fromPage: string, toPage: string, method: 'click' | 'direct' | 'back') => {
      trackWithUserContext('navigation', {
        from_page: fromPage,
        to_page: toPage,
        navigation_method: method
      });
    }, [trackWithUserContext]),

    trackFeatureUsage: useCallback((feature: string, context?: any) => {
      trackWithUserContext('feature_usage', {
        feature_name: feature,
        feature_context: context
      });
    }, [trackWithUserContext]),

    trackContentEngagement: useCallback((contentType: string, contentId: string, engagementType: string, duration?: number) => {
      trackWithUserContext('content_engagement', {
        content_type: contentType,
        content_id: contentId,
        engagement_type: engagementType,
        engagement_duration: duration
      });
    }, [trackWithUserContext])
  };
}

// 페이지별 특화 Hook들
export function useProjectAnalytics() {
  const { trackProjectInteraction, projectView, trackContentEngagement } = useAnalytics();

  return {
    trackView: (projectId: number, title: string, techStacks: string[]) => {
      projectView(projectId, title, techStacks);
    },
    
    trackTechStackClick: (projectId: number, techStack: string) => {
      trackProjectInteraction(projectId, 'tech_stack_click', { tech_stack: techStack });
    },
    
    trackGitHubClick: (projectId: number, githubUrl: string) => {
      trackProjectInteraction(projectId, 'github_click', { github_url: githubUrl });
    },
    
    trackDemoClick: (projectId: number, demoUrl: string) => {
      trackProjectInteraction(projectId, 'demo_click', { demo_url: demoUrl });
    },
    
    trackProjectTimeSpent: (projectId: number, timeSpent: number) => {
      trackContentEngagement('project', projectId.toString(), 'time_spent', timeSpent);
    }
  };
}

export function useAcademicsAnalytics() {
  const { academicView, trackContentEngagement, trackFeatureUsage } = useAnalytics();

  return {
    trackView: (academicId: number, subjectName: string, semester: string) => {
      academicView(academicId, subjectName, semester);
    },
    
    trackGradeView: (academicId: number, grade: string) => {
      trackContentEngagement('academic', academicId.toString(), 'grade_view', undefined);
      trackFeatureUsage('grade_disclosure', { academic_id: academicId, grade });
    },
    
    trackSemesterFilter: (semester: string, resultCount: number) => {
      analytics.filter('semester', semester, resultCount);
    },
    
    trackGPAView: (gpa: number) => {
      trackFeatureUsage('gpa_view', { gpa_value: gpa });
    }
  };
}

export function useAuthAnalytics() {
  const { login, trackFeatureUsage, error } = useAnalytics();

  return {
    trackLoginAttempt: (method: 'google' | 'email' | 'github') => {
      trackFeatureUsage('login_attempt', { method });
    },
    
    trackLoginSuccess: (method: 'google' | 'email' | 'github') => {
      login(method, true);
    },
    
    trackLoginFailure: (method: 'google' | 'email' | 'github', errorMessage: string) => {
      login(method, false);
      error(errorMessage, 'auth');
    },
    
    trackTwoFactorUsage: (success: boolean) => {
      trackFeatureUsage('two_factor_auth', { success });
    },
    
    trackLogout: () => {
      trackFeatureUsage('logout');
    }
  };
}

// 성능 모니터링 Hook
export function usePerformanceAnalytics() {
  const { performance: trackPerformance } = useAnalytics();

  const trackPageLoadTime = useCallback(() => {
    if (window.performance && window.performance.timing) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      trackPerformance('page_load_time', loadTime, 'ms');
    }
  }, [trackPerformance]);

  const trackAPIResponseTime = useCallback((endpoint: string, responseTime: number) => {
    trackPerformance(`api_response_time_${endpoint}`, responseTime, 'ms');
  }, [trackPerformance]);

  const trackComponentRenderTime = useCallback((componentName: string, renderTime: number) => {
    trackPerformance(`component_render_time_${componentName}`, renderTime, 'ms');
  }, [trackPerformance]);

  useEffect(() => {
    // 페이지 로드 완료 시 성능 측정
    if (document.readyState === 'complete') {
      trackPageLoadTime();
    } else {
      window.addEventListener('load', trackPageLoadTime);
      return () => window.removeEventListener('load', trackPageLoadTime);
    }
  }, [trackPageLoadTime]);

  return {
    trackPageLoadTime,
    trackAPIResponseTime,
    trackComponentRenderTime
  };
}
