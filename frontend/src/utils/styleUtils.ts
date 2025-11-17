import { Theme } from '../styles/theme'

/**
 * Style Utility Functions
 * Helper functions for responsive design and consistent styling
 */

/**
 * Get responsive value based on breakpoint
 * @param mobile - Value for mobile
 * @param tablet - Value for tablet (optional)
 * @param desktop - Value for desktop (optional)
 * @returns CSS string with media queries
 */
export const getResponsiveValue = (
  mobile: string,
  tablet?: string,
  desktop?: string
): string => {
  let css = mobile
  
  if (tablet) {
    css += `
      @media (min-width: 768px) {
        ${tablet}
      }
    `
  }
  
  if (desktop) {
    css += `
      @media (min-width: 1024px) {
        ${desktop}
      }
    `
  }
  
  return css
}

/**
 * Get responsive font size using clamp
 * @param min - Minimum size (px)
 * @param preferred - Preferred size (px or vw)
 * @param max - Maximum size (px)
 * @returns CSS clamp string
 */
export const getResponsiveFontSize = (
  min: number,
  preferred: string | number,
  max: number
): string => {
  const preferredValue = typeof preferred === 'number' ? `${preferred}px` : preferred
  return `clamp(${min}px, ${preferredValue}, ${max}px)`
}

/**
 * Get theme breakpoint value
 * @param breakpoint - Breakpoint key
 * @param theme - Theme object
 * @returns Breakpoint value
 */
export const getBreakpoint = (breakpoint: keyof Theme['breakpoints'], theme: Theme): string => {
  return theme.breakpoints[breakpoint]
}

/**
 * Media query helper
 * @param breakpoint - Breakpoint key
 * @param theme - Theme object
 * @param styles - Styles to apply
 * @returns CSS string with media query
 */
export const mediaQuery = (
  breakpoint: keyof Theme['breakpoints'],
  theme: Theme,
  styles: string
): string => {
  return `
    @media (min-width: ${theme.breakpoints[breakpoint]}) {
      ${styles}
    }
  `
}

/**
 * Get spacing value from theme
 * @param size - Spacing size key
 * @param theme - Theme object
 * @returns Spacing value
 */
export const getSpacing = (size: keyof Theme['spacing'], theme: Theme): string => {
  return theme.spacing[size]
}

/**
 * Get color value from theme
 * @param path - Color path (e.g., 'primary.500')
 * @param theme - Theme object
 * @returns Color value
 */
export const getColor = (path: string, theme: Theme): string => {
  const parts = path.split('.')
  let value: any = theme.colors
  
  for (const part of parts) {
    value = value[part]
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in theme`)
      return '#000000'
    }
  }
  
  return value
}



