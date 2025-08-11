export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    accent: '#06B6D4',
    text: '#0F172A',
    textSecondary: '#334155',
    border: '#E2E8F0',
    bg: '#FFFFFF',
  },
  dark: {
    bg: '#0B1220',
    card: '#0F172A',
    text: '#E5E7EB',
    border: '#1F2937',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadow: {
    1: '0 2px 8px rgba(0,0,0,.06)',
    2: '0 6px 20px rgba(0,0,0,.08)',
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
}

export type Theme = typeof theme
