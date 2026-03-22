// Modern DevOps-focused Design System
// 
// Design Principles:
// 1. DevOps Color Palette: Slate Dark + Sky Blue accents for professional tech feel
// 2. Single Font Family: Inter for clean, modern typography
// 3. CTA Focus: Primary colors reserved for call-to-action elements
// 4. Consistency: Unified spacing, border-radius, and animation patterns
// Reference: KickoffLabs design guidelines

// Base Theme (Shared Elements)
const baseTheme = {
  // 색상 시스템 - 미래지향적 팔레트
  colors: {
    // Primary - Electric Blue 계열 (CTA 전용 색상)
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

    // Secondary - Cyber Purple 계열 (KickoffLabs 원칙 준수: 제거됨, 하위 호환성을 위해 Primary로 매핑)
    // KickoffLabs 원칙: 색상 팔레트를 1-3개로 제한 (Primary + Neutral만 사용)
    secondary: {
      50: '#eff6ff',  // primary[50]으로 매핑
      100: '#dbeafe', // primary[100]으로 매핑
      200: '#bfdbfe', // primary[200]으로 매핑
      300: '#93c5fd', // primary[300]으로 매핑
      400: '#60a5fa', // primary[400]으로 매핑
      500: '#3b82f6', // primary[500]으로 매핑
      600: '#2563eb', // primary[600]으로 매핑
      700: '#1d4ed8', // primary[700]으로 매핑
      800: '#1e40af', // primary[800]으로 매핑
      900: '#1e3a8a', // primary[900]으로 매핑
      950: '#172554'  // primary[950]으로 매핑
    },

    // Accent - Neon Green 계열 (KickoffLabs 원칙 준수: 제거됨, 하위 호환성을 위해 Primary로 매핑)
    accent: {
      50: '#eff6ff',  // primary[50]으로 매핑
      100: '#dbeafe', // primary[100]으로 매핑
      200: '#bfdbfe', // primary[200]으로 매핑
      300: '#93c5fd', // primary[300]으로 매핑
      400: '#60a5fa', // primary[400]으로 매핑
      500: '#3b82f6', // primary[500]으로 매핑
      600: '#2563eb', // primary[600]으로 매핑
      700: '#1d4ed8', // primary[700]으로 매핑
      800: '#1e40af', // primary[800]으로 매핑
      900: '#1e3a8a', // primary[900]으로 매핑
      950: '#172554'  // primary[950]으로 매핑
    },

    // Neutral - DevOps Slate Gray (Professional tech palette)
    neutral: {
      0: '#ffffff',
      50: '#f8fafc',   // Slate 50
      100: '#f1f5f9',  // Slate 100
      200: '#e2e8f0',  // Slate 200
      300: '#cbd5e1',  // Slate 300
      400: '#94a3b8',  // Slate 400
      500: '#64748b',  // Slate 500
      600: '#475569',  // Slate 600
      700: '#334155',  // Slate 700
      800: '#1e293b',  // Slate 800
      900: '#0f172a',  // Slate 900 - DevOps Dark BG
      950: '#020617'   // Slate 950
    },

    // Semantic Colors (DevOps-friendly)
    success: '#10b981',  // Emerald - Deployment success
    warning: '#f59e0b',  // Amber - Warnings
    error: '#ef4444',    // Red - Errors
    info: '#38bdf8',     // Sky Blue - Info/Primary accent

    // 특별한 색상 (KickoffLabs 원칙 준수: Primary만 사용)
    gradient: {
      // Primary gradient만 유지 (Primary 계열만 사용)
      primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      // Secondary, Accent gradient 제거 (하위 호환성을 위해 Primary로 매핑)
      secondary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      accent: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      neon: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      hero: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },

    // 글래스모피즘
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(0, 0, 0, 0.1)'
    },

    // Hero 섹션 전용 색상 (Primary 배경 위의 흰색 텍스트)
    hero: {
      text: 'rgba(255, 255, 255, 0.95)',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      textMuted: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.15)',
      backgroundHover: 'rgba(255, 255, 255, 0.25)',
      outline: 'rgba(255, 255, 255, 0.6)'
    }
  },

  // 타이포그래피 시스템 (KickoffLabs 원칙 준수: Inter만 사용)
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // mono, display 제거 (KickoffLabs 원칙: 1-2개 폰트만 사용)
      // 하위 호환성을 위해 primary로 매핑
      mono: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
    },

    role: {
      tech: 'primary',
      essay: 'display'
    }
  },

  // 간격 시스템 (4-point spacing system - 모든 값은 4px의 배수)
  // 참고: https://uxplanet.org/principles-of-spacing-in-ui-design-a-beginners-guide-to-the-4-point-spacing-system-6e88233b527a
  spacing: {
    0: '0px',
    0.5: '0.25rem',   // 4px (하위 호환성: 2px → 4px)
    1: '0.25rem',     // 4px
    1.5: '0.5rem',    // 8px (하위 호환성: 6px → 8px)
    2: '0.5rem',      // 8px
    2.5: '0.75rem',   // 12px (하위 호환성: 10px → 12px)
    3: '0.75rem',     // 12px
    3.5: '1rem',      // 16px (하위 호환성: 14px → 16px)
    4: '1rem',        // 16px
    5: '1.5rem',      // 24px (하위 호환성: 20px → 24px)
    6: '1.5rem',      // 24px
    7: '2rem',        // 32px (하위 호환성: 28px → 32px)
    8: '2rem',        // 32px
    9: '2.5rem',      // 40px (하위 호환성: 36px → 40px)
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

    // 글로우 효과 (KickoffLabs 원칙 준수: Primary만 사용)
    glow: {
      primary: '0 0 20px rgba(59, 130, 246, 0.5)',
      // Secondary, Accent glow 제거 (하위 호환성을 위해 Primary로 매핑)
      secondary: '0 0 20px rgba(59, 130, 246, 0.5)',
      accent: '0 0 20px rgba(59, 130, 246, 0.5)',
      neon: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6)'
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

  // 반지름 별칭
  radius: baseTheme.borderRadius,

  colors: {
    ...baseTheme.colors,

    // 테마별 시맨틱 컬러
    background: baseTheme.colors.neutral[0],
    surface: baseTheme.colors.neutral[50],
    text: baseTheme.colors.neutral[900],
    textSecondary: baseTheme.colors.neutral[600],
    textMuted: baseTheme.colors.neutral[500],
    border: baseTheme.colors.neutral[200],
    divider: baseTheme.colors.neutral[100],

    // 배경 별칭
    bg: baseTheme.colors.neutral[0]
  }
};

// Dark Theme (DevOps Professional)
export const darkTheme = {
  ...baseTheme,
  mode: 'dark' as const,

  // Border radius alias
  radius: baseTheme.borderRadius,

  colors: {
    ...baseTheme.colors,

    // DevOps Dark Theme - Professional Slate palette
    background: '#0f172a',           // Slate 900 - Deep professional dark
    surface: '#1e293b',              // Slate 800 - Elevated surfaces
    text: '#f8fafc',                 // Slate 50 - High contrast text
    textSecondary: '#94a3b8',        // Slate 400 - Secondary text
    textMuted: '#64748b',            // Slate 500 - Muted text
    border: '#334155',               // Slate 700 - Subtle borders
    divider: '#1e293b',              // Slate 800 - Dividers

    // Background alias
    bg: '#0f172a',                   // Slate 900
    gradient: {
      ...baseTheme.colors.gradient,
      hero: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }
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

// EVA Theme (Semantic alternative mode)
export const evaTheme = {
  ...darkTheme,
  mode: 'eva' as const,

  colors: {
    ...darkTheme.colors,
    primary: {
      ...darkTheme.colors.primary,
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed'
    },
    background: '#120f1d',
    surface: '#1b1530',
    text: '#f5f3ff',
    textSecondary: '#c4b5fd',
    border: '#4c1d95',
    info: '#a78bfa',
    gradient: {
      ...darkTheme.colors.gradient,
      primary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      hero: 'linear-gradient(135deg, #312e81 0%, #581c87 100%)'
    },
    hero: {
      ...darkTheme.colors.hero,
      text: 'rgba(245, 243, 255, 0.98)',
      textSecondary: 'rgba(221, 214, 254, 0.95)',
      textMuted: 'rgba(196, 181, 253, 0.86)'
    }
  },

  typography: {
    ...darkTheme.typography,
    role: {
      tech: 'mono',
      essay: 'display'
    }
  }
};

export const themeByMode = (mode: 'dark' | 'eva') => (mode === 'eva' ? evaTheme : darkTheme)

// 타입 정의
export type Theme = typeof lightTheme | typeof darkTheme | typeof evaTheme;
export type ThemeColors = typeof lightTheme.colors;
export type ThemeSpacing = typeof lightTheme.spacing;

// 기본 테마 (라이트)
export const defaultTheme = lightTheme;

export default defaultTheme;
