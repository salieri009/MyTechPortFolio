export interface PersonalInfo {
  name: string;
  title: string;          // "Full Stack Developer" 등
  experience: string;     // "2년차 개발자" 등
  location: string;       // "서울, 대한민국"
  email: string;
  phone: string;
  github: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CareerSummary {
  totalProjects: number;
  totalExperience: string;
  primarySkills: string[];
  industryFocus: string[];
  achievements: Achievement[];
}

export interface Achievement {
  title: string;
  description: string;
  impact: string;         // "성능 30% 개선" 등
  date: Date;
}

export interface ProjectImpact {
  technicalComplexity: 1 | 2 | 3 | 4 | 5;
  teamSize: number;
  duration: string;
  role: string;           // "Lead Developer", "Backend Developer" 등
  businessImpact?: string; // "사용자 만족도 증가" 등
  metrics?: ProjectMetric[];
}

export interface ProjectMetric {
  label: string;          // "성능 개선", "사용자 증가" 등
  value: string;          // "40%", "1000명" 등
}

export interface RecruiterAnalytics {
  viewDuration: number;           // 평균 체류 시간
  sectionEngagement: {            // 섹션별 관심도
    header: number;
    projects: number;
    skills: number;
    academics: number;
    contact: number;
  };
  exitPoints: string[];           // 이탈 지점
  deviceType: 'mobile' | 'tablet' | 'desktop';
  referralSource: string;         // 유입 경로
}
