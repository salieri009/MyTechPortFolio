// 미래지향적이고 세련된 디자인 시스템

// 베이스 테마 (공통 요소)
const baseTheme = {
  // 색상 시스템 - 미래지향적 팔레트
  colors: {
    // Primary - Electric Blue 계열
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // 메인 브랜드 컬러
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },

    // Secondary - Cyber Purple 계열  
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // 보조 브랜드 컬러
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },

    // Accent - Neon Green 계열
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // 강조 컬러
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },

    // Neutral - Modern Gray 계열
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a'
    },

    // Semantic Colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // 특별한 색상
    gradient: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      accent: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
      dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      neon: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%)'
    },

    // 글래스모피즘
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(0, 0, 0, 0.1)'
    }
  },

  // 타이포그래피 시스템
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
      display: '"Space Grotesk", "Inter", sans-serif'
    },

    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px  
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem'      // 128px
    },

    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },

    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em', 
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  // 간격 시스템 (rem 기준)
  spacing: {
    0: '0px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },

  // 반지름 시스템
  borderRadius: {
    none: '0px',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // 그림자 시스템 - 미래지향적 느낌
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    
    // 글로우 효과
    glow: {
      primary: '0 0 20px rgba(59, 130, 246, 0.5)',
      secondary: '0 0 20px rgba(168, 85, 247, 0.5)',
      accent: '0 0 20px rgba(34, 197, 94, 0.5)',
      neon: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)'
    },

    // 네오모피즘
    neumorphism: {
      light: '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
      dark: '6px 6px 12px #0a0a0a, -6px -6px 12px #2a2a2a'
    }
  },

  // 애니메이션
  animation: {
    duration: {
      fastest: '100ms',
      fast: '200ms', 
      normal: '300ms',
      slow: '500ms',
      slowest: '1000ms'
    },

    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
    }
  },

  // Z-Index 관리
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // 반응형 브레이크포인트
  breakpoints: {
    xs: '475px',   // 📱 모바일 
    sm: '640px',   // 📱 큰 모바일
    md: '768px',   // 📟 태블릿
    lg: '1024px',  // 💻 데스크톱
    xl: '1280px',  // 🖥️ 큰 데스크톱
    '2xl': '1536px' // 🖥️ 와이드 모니터
  },

  // 애니메이션 효과
  hoverTransition: (property = 'all', duration = '0.2s') => ({
    transition: `${property} ${duration} cubic-bezier(0.4, 0, 0.2, 1)`
  })
};

// 라이트 테마
export const lightTheme = {
  ...baseTheme,
  mode: 'light' as const,
  colors: {
    ...baseTheme.colors,
    
    // 테마별 시맨틱 컬러
    background: baseTheme.colors.neutral[0],
    surface: baseTheme.colors.neutral[50],
    text: baseTheme.colors.neutral[900],
    textSecondary: baseTheme.colors.neutral[600],
    textMuted: baseTheme.colors.neutral[500],
    border: baseTheme.colors.neutral[200],
    divider: baseTheme.colors.neutral[100]
  }
};

// 다크 테마
export const darkTheme = {
  ...baseTheme,
  mode: 'dark' as const,
  colors: {
    ...baseTheme.colors,
    
    // 테마별 시맨틱 컬러
    background: baseTheme.colors.neutral[950],
    surface: baseTheme.colors.neutral[900],
    text: baseTheme.colors.neutral[50],
    textSecondary: baseTheme.colors.neutral[300],
    textMuted: baseTheme.colors.neutral[400],
    border: baseTheme.colors.neutral[700],
    divider: baseTheme.colors.neutral[800]
  },

  // 다크 테마용 그림자
  shadows: {
    ...baseTheme.shadows,
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
  }
};

// 타입 정의
export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;
export type ThemeSpacing = typeof lightTheme.spacing;

// 기본 테마 (라이트)
export const defaultTheme = lightTheme;

export default defaultTheme;
