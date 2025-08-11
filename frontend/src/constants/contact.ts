export const CONTACT_INFO = {
  email: {
    student: 'jungwook.van-1@student.uts.edu.au',
    display: 'jungwook.van-1@student.uts.edu.au'
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/jungwook-van-562827293/',
    display: 'linkedin.com/in/jungwook-van-562827293'
  },
  github: {
    url: 'https://github.com/salieri009', // 실제 GitHub URL로 수정해주세요
    display: 'github.com/jungwook-van'
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

export type ContactInfo = typeof CONTACT_INFO
