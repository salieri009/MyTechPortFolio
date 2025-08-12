import 'styled-components'
import type { lightTheme, darkTheme } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: typeof lightTheme.colors;
    radius: typeof lightTheme.radius;
    spacing: typeof lightTheme.spacing;
    typography: typeof lightTheme.typography;
    shadows: typeof lightTheme.shadows;
    animation: typeof lightTheme.animation;
    zIndex: typeof lightTheme.zIndex;
    breakpoints: typeof lightTheme.breakpoints;
    hoverTransition: typeof lightTheme.hoverTransition;
    borderRadius: typeof lightTheme.radius;
  }
}
