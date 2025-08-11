import type { PersonalInfo, CareerSummary } from '../types/recruiter'

export const CONTACT_INFO = {
  email: {
    student: 'jungwook.van-1@student.uts.edu.au',
    display: 'jungwook.van-1@student.uts.edu.au'
  },
  phone: {
    display: '+61 4XX XXX XXX', // 실제 번호로 변경 필요
    href: 'tel:+61400000000'
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/jungwook-van-562827293/',
    display: 'linkedin.com/in/jungwook-van-562827293'
  },
  github: {
    url: 'https://github.com/salieri009',
    display: 'github.com/salieri009'
  },
  name: {
    full: 'Jungwook Van',
    first: 'Jungwook',
    last: 'Van'
  },
  university: {
    name: 'University of Technology Sydney',
    shortName: 'UTS',
    program: 'Bachelor of Computer Science',
    year: '2023 - Present'
  }
} as const

export const PERSONAL_INFO: PersonalInfo = {
  name: 'Jungwook Van',
  title: 'Full Stack Developer',
  experience: '2년차 개발자',
  location: '시드니, 호주',
  email: CONTACT_INFO.email.student,
  phone: CONTACT_INFO.phone.display,
  github: CONTACT_INFO.github.url,
  linkedin: CONTACT_INFO.linkedin.url,
  portfolio: 'https://jungwook-portfolio.vercel.app' // 실제 포트폴리오 URL로 변경
}

export const CAREER_SUMMARY: CareerSummary = {
  totalProjects: 15,
  totalExperience: '2년',
  primarySkills: ['React', 'TypeScript', 'Spring Boot', 'Java', 'MySQL'],
  industryFocus: ['웹 개발', 'Full Stack', '사용자 경험'],
  achievements: [
    {
      title: '성능 최적화',
      description: '웹 애플리케이션 로딩 속도 개선',
      impact: '로딩 시간 40% 단축',
      date: new Date('2024-06-01')
    },
    {
      title: '사용자 경험 개선',
      description: '인터페이스 리디자인 및 반응형 구현',
      impact: '사용자 만족도 95% 달성',
      date: new Date('2024-08-01')
    },
    {
      title: '코드 품질 향상',
      description: 'TypeScript 도입 및 테스트 커버리지 증대',
      impact: '버그 발생률 60% 감소',
      date: new Date('2024-07-01')
    }
  ]
}

export type ContactInfo = typeof CONTACT_INFO
