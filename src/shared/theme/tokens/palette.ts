/**
 * Skillar Mobile Color Palette Tokens
 *
 * Single source of truth for color primitives, aligned with Skillar Web (`tokens.css`).
 * Contains canonical brand ramps, neutrals, semantic feedback ramps, and domain accents.
 *
 * NOTE: Raw hex codes are strictly confined to this file per Architecture Guardrails.
 */

// ---------------------------------------------------------------------------
// Shade & Ramp Types
// ---------------------------------------------------------------------------

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type ColorRamp = Record<ColorShade, string>;

// ---------------------------------------------------------------------------
// Palette Definition
// ---------------------------------------------------------------------------

export const palette = {
  /**
   * Skillar Canonical Brand Ramp (Purple)
   * Primary brand identity color scale.
   */
  brand: {
    50: '#F4F1FF',
    100: '#EBE5FF',
    200: '#D8CCFF',
    300: '#BFACFF',
    400: '#A489FF',
    500: '#8B6CFF',
    600: '#6C47FF', // Brand Light primary
    700: '#5835E8', // Light primary pressed
    800: '#4728C4',
    900: '#381F9E',
    950: '#24125F',
    // Key accent roles
    primaryLight: '#6C47FF',
    primaryPressedLight: '#5835E8',
    primaryDark: '#7C5CFF', // Dark Primary Accent
    primaryPressedDark: '#9378FF',
    primaryForegroundLight: '#FFFFFF',
    primaryForegroundDark: '#0B1120',
    primaryTintLight: '#EFEAFF',
    primaryTintDark: '#2A1F66',
  },

  /**
   * Purple alias mapping directly to the Skillar brand purple ramp.
   * Replaces generic Tailwind purple ramp.
   */
  purple: {
    50: '#F4F1FF',
    100: '#EBE5FF',
    200: '#D8CCFF',
    300: '#BFACFF',
    400: '#A489FF',
    500: '#8B6CFF',
    600: '#6C47FF',
    700: '#5835E8',
    800: '#4728C4',
    900: '#381F9E',
    950: '#24125F',
    accentDark: '#7C5CFF',
  },

  /**
   * Slate Neutral Ramp (50 to 950)
   * Matches web tokens.css graphite/ink neutrals.
   */
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  /**
   * Light Theme Canvas & Content Tokens
   */
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FAFC',
    surfaceMuted: '#F1F5F9',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    text: '#0F172A',
    textMuted: '#475569',
    textDisabled: '#94A3B8',
    primary: '#6C47FF',
    primaryPressed: '#5835E8',
    primaryForeground: '#FFFFFF',
    primaryTint: '#EFEAFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  /**
   * Dark Theme Canvas & Content Tokens
   * Calibrated for OLED/LCD mobile screens with WCAG AA compliance.
   */
  dark: {
    background: '#0B1120',
    surface: '#111827',
    surfaceElevated: '#1E293B',
    surfaceMuted: '#172033',
    border: '#293548',
    borderStrong: '#475569',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textDisabled: '#475569',
    primary: '#7C5CFF', // Dark primary accent
    primaryPressed: '#9378FF',
    primaryForeground: '#0B1120',
    primaryTint: '#2A1F66',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  /**
   * Backward-compatible Skillar brand bundle
   */
  skillar: {
    primary: '#6C47FF',
    primaryPressed: '#5835E8',
    primaryDark: '#7C5CFF',
    primaryDarkPressed: '#9378FF',
    primaryTintLight: '#EFEAFF',
    primaryTintDark: '#2A1F66',
    teal: '#00D4B4',
    background: '#F7F7FB',
    surface: '#FFFFFF',
    text: '#202033',
    textMuted: '#6F7185',
    border: '#E5E6EF',
  },

  /**
   * Semantic Feedback Ramps (WCAG AA Compliant >= 4.5:1)
   * Light mode uses 700 shades for signals, 50 for surfaces, 200 for borders.
   * Dark mode uses 400 shades for signals, 950 for surfaces, 900 for borders.
   */
  feedback: {
    success: {
      light: {
        signal: '#15803D', // 4.6:1 against #F0FDF4
        surface: '#F0FDF4',
        border: '#BBF7D0',
      },
      dark: {
        signal: '#4ADE80', // 9.2:1 against #052E16
        surface: '#052E16',
        border: '#14532D',
      },
    },
    warning: {
      light: {
        signal: '#A16207', // 4.7:1 against #FEFCE8
        surface: '#FEFCE8',
        border: '#FEF08A',
      },
      dark: {
        signal: '#FACC15', // 10.5:1 against #422006
        surface: '#422006',
        border: '#713F12',
      },
    },
    error: {
      light: {
        signal: '#B91C1C', // 5.6:1 against #FEF2F2
        surface: '#FEF2F2',
        border: '#FECACA',
      },
      dark: {
        signal: '#F87171', // 6.2:1 against #450A0A
        surface: '#450A0A',
        border: '#7F1D1D',
      },
    },
    info: {
      light: {
        signal: '#1D4ED8', // 5.8:1 against #EFF6FF
        surface: '#EFF6FF',
        border: '#BFDBFE',
      },
      dark: {
        signal: '#60A5FA', // 6.5:1 against #172554
        surface: '#172554',
        border: '#1E3A8A',
      },
    },
  },

  /**
   * Standard Color Ramps
   */
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },

  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
    950: '#422006',
  },

  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },

  /**
   * LXP Domain Specific Colors
   */
  domain: {
    streakFlameLight: '#F97316',
    streakFlameDark: '#FB923C',
    streakSurfaceLight: '#FFF7ED',
    streakSurfaceDark: '#431407',
    masteryNovice: '#94A3B8',
    masteryIntermediate: '#3B82F6',
    masteryAdvanced: '#8B6CFF',
    masteryExpert: '#F59E0B',
  },

  /**
   * Base & Overlay Primitives
   */
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const;

export type Palette = typeof palette;
