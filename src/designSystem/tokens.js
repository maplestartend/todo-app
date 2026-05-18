/**
 * Minimal Warm — design tokens.
 *
 * Single source of truth for spacing, radius, elevation, typography and
 * motion. Theme-dependent values (colors) live in src/theme.js — keep them
 * separate so this file is light, JSON-like, and easy to scan when iterating
 * on the visual language.
 */

// 8pt grid spacing
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 26,
  xxl: 32,
};

// Page / list horizontal padding presets
export const pad = {
  pageX: 22,
  listX: 22,
  sectionX: 26,
};

// iOS-leaning radius scale
export const radius = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
};

// Elevation scale — used as `shadow(T, 'md')` so dark mode can mix darker
// shadows automatically.
export const shadow = (T, level = 'md') => {
  const a = T.isDark ? 0.45 : 0.14;
  const map = {
    sm: `0 2px 6px rgba(0,0,0,${a * 0.55})`,
    md: `0 6px 18px rgba(0,0,0,${a})`,
    lg: `0 12px 32px rgba(0,0,0,${a * 1.25})`,
  };
  return map[level] || map.md;
};

// Typography scale
export const font = {
  display: 28,
  title: 19,
  body: 16,
  small: 13,
  tiny: 11,
  mono: 11,
};

export const lineHeight = {
  tight: 1.2,
  body: 1.4,
  relaxed: 1.55,
};

export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

// Motion — spring-leaning curves so transitions feel iOS-native.
export const motion = {
  // standard ease-out used by checkbox / fade / opacity
  ease: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  // iOS push / pop — quick out, soft land
  enter: 'cubic-bezier(0.32, 0.72, 0, 1)',
  // gentle return for soft state changes
  exit: 'cubic-bezier(0.4, 0, 0.6, 1)',
  durFast: 160,
  durBase: 240,
  durSlow: 360,
};

// Min touch target per HIG / WCAG
export const touch = {
  min: 44,
};
