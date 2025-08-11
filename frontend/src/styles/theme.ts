export const lightTheme = {
  colors: {
    primary: '#4F46E5',
    primaryDark: '#3730A3',
    secondary: '#06B6D4',
    bg: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem'
  }
}

export const darkTheme = {
  colors: {
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    secondary: '#06D6A0',
    bg: '#0F172A',
    bgSecondary: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.6)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.7)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.8)'
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem'
  }
}

export type Theme = typeof lightTheme

// 기존 호환성을 위한 theme export
export const theme = lightTheme
