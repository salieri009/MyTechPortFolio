import type { PersonalInfo, CareerSummary } from '../types/recruiter'

export const CONTACT_INFO = {
  email: {
    student: 'jungwook.van-1@student.uts.edu.au',
    display: 'jungwook.van-1@student.uts.edu.au'
  },
  phone: {
    display: '+61 413719847',
    href: 'tel:+61413719847'
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
    program: 'Bachelor of IT, Enterprise Software Development',
    year: 'April 2024 - July 2026'
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
  portfolio: 'https://salieri009.studio' // 실제 포트폴리오 URL로 변경
}

export const CAREER_SUMMARY: CareerSummary = {
  totalProjects: 11,
  totalExperience: '2년',
  primarySkills: ['Java', 'JavaScript', 'Python', 'SQL', 'C++', 'HTML5', 'CSS3', 'React', 'Vue.js', 'Three.js'],
  industryFocus: ['웹 개발', '게임 개발', 'AI/ML', '클라우드 컴퓨팅', 'IoT', '3D 그래픽스'],
  achievements: [
    {
      title: '',
      description: '',
      impact: '',
      date: new Date('2025-06-01')
    },
    {
      title: '',
      description: '',
      impact: '',
      date: new Date('2025-08-01')
    },
    {
      title: '',
      description: '',
      impact: '',
      date: new Date('2025-07-01')
    }
  ]
}

export type ContactInfo = typeof CONTACT_INFO
