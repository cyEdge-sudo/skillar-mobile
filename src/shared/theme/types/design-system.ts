import type { TextStyle, ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Semantic Feedback Ramps (WCAG AA Compliant)
// ---------------------------------------------------------------------------

/**
 * Three-tier feedback ramp for accessible status indicators.
 * - signal: High-contrast foreground text/icon color (meets >= 4.5:1 WCAG AA)
 * - surface: Subtle tinted container background
 * - border: Hairline separator matching surface tint
 */
export interface ColorFeedbackRamp {
  readonly signal: string;
  readonly surface: string;
  readonly border: string;
}

export interface SemanticFeedbackTokens {
  readonly success: ColorFeedbackRamp;
  readonly warning: ColorFeedbackRamp;
  readonly error: ColorFeedbackRamp;
  readonly info: ColorFeedbackRamp;
}

// ---------------------------------------------------------------------------
// Canvas & Surface Tokens
// ---------------------------------------------------------------------------

export interface CanvasTokens {
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly surfaceMuted: string;
  readonly border: string;
  readonly borderStrong: string;
}

// ---------------------------------------------------------------------------
// Content Tokens
// ---------------------------------------------------------------------------

export interface ContentTokens {
  readonly text: string;
  readonly textMuted: string;
  readonly textDisabled: string;
}

// ---------------------------------------------------------------------------
// Brand Tokens
// ---------------------------------------------------------------------------

export interface BrandTokens {
  readonly primary: string;
  readonly primaryPressed: string;
  readonly primaryForeground: string;
  readonly primaryTint: string;
}

// ---------------------------------------------------------------------------
// LXP Domain Tokens
// ---------------------------------------------------------------------------

export interface RoadmapStepStatusColors {
  readonly locked: ColorFeedbackRamp;
  readonly inProgress: ColorFeedbackRamp;
  readonly completed: ColorFeedbackRamp;
}

export interface StreakTokens {
  readonly flame: string;
  readonly surface: string;
  readonly border: string;
  readonly text: string;
}

export interface MasteryTokens {
  readonly novice: string;
  readonly intermediate: string;
  readonly advanced: string;
  readonly expert: string;
}

export interface JourneyTokens {
  readonly cardBackground: string;
  readonly trackActive: string;
  readonly trackInactive: string;
}

export interface LxpDomainTokens {
  readonly roadmapStep: RoadmapStepStatusColors;
  readonly streak: StreakTokens;
  readonly mastery: MasteryTokens;
  readonly journey: JourneyTokens;
}

// ---------------------------------------------------------------------------
// Grouped Semantic Colors (backward compatible & structured access)
// ---------------------------------------------------------------------------

export interface SemanticColors {
  readonly primary: string;
  readonly secondary: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated?: string;
  readonly surfaceMuted?: string;
  readonly surfaceVariant: string;
  readonly text: string;
  readonly textMuted?: string;
  readonly textSecondary: string;
  readonly textDisabled: string;
  readonly border: string;
  readonly borderStrong?: string;
  readonly divider: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
  readonly overlay: string;
  readonly white: string;
  readonly black: string;
  readonly transparent: string;

  // Modern additions
  readonly primaryPressed?: string;
  readonly primaryForeground?: string;
  readonly primaryTint?: string;
  readonly feedback?: SemanticFeedbackTokens;

  // Convenience feedback surfaces & borders
  readonly successSurface?: string;
  readonly successBorder?: string;
  readonly warningSurface?: string;
  readonly warningBorder?: string;
  readonly errorSurface?: string;
  readonly errorBorder?: string;
  readonly infoSurface?: string;
  readonly infoBorder?: string;
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export interface TypographyStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: TextStyle['fontWeight'];
  readonly lineHeight: number;
  readonly letterSpacing: number;
}

/**
 * Mobile-calibrated 8-Tier Skillar Typography Scale
 * display (32/38), h1 (28/34), h2 (24/30), h3 (20/26), h4 (16/22),
 * bodyLg (16/24), body (14/20), sm (12/16).
 */
export interface Typography {
  // Canonical 8-tier scale
  readonly display: TypographyStyle;
  readonly h1: TypographyStyle;
  readonly h2: TypographyStyle;
  readonly h3: TypographyStyle;
  readonly h4: TypographyStyle;
  readonly bodyLg: TypographyStyle;
  readonly body: TypographyStyle;
  readonly sm: TypographyStyle;

  // Backward-compatible legacy aliases (guaranteed present at runtime)
  readonly displayLarge: TypographyStyle;
  readonly displayMedium: TypographyStyle;
  readonly displaySmall: TypographyStyle;
  readonly headlineLarge: TypographyStyle;
  readonly headlineMedium: TypographyStyle;
  readonly headlineSmall: TypographyStyle;
  readonly titleLarge: TypographyStyle;
  readonly titleMedium: TypographyStyle;
  readonly titleSmall: TypographyStyle;
  readonly bodyLarge: TypographyStyle;
  readonly bodyMedium: TypographyStyle;
  readonly bodySmall: TypographyStyle;
  readonly labelLarge: TypographyStyle;
  readonly labelMedium: TypographyStyle;
  readonly labelSmall: TypographyStyle;
  readonly caption: TypographyStyle;
  readonly overline: TypographyStyle;
}

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export interface Spacing {
  readonly 0: number;
  readonly 1: number;
  readonly 2: number;
  readonly 3: number;
  readonly 4: number;
  readonly 5: number;
  readonly 6: number;
  readonly 8: number;
  readonly 10: number;
  readonly 12: number;
  readonly 16: number;
  readonly 20: number;
  readonly 24: number;
  readonly 32: number;
  readonly 40: number;
  readonly 48: number;
  readonly 64: number;
  readonly gutter: number;
  readonly touchTarget: number;
  readonly minTouchTarget: number;
  readonly [key: number]: number;
}

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------

export interface Radius {
  // Named radius tokens (spec section 2.C)
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
  readonly full: number;

  // Numeric step radius tokens (for backward compatibility)
  readonly 0: number;
  readonly 2: number;
  readonly 4: number;
  readonly 8: number;
  readonly 12: number;
  readonly 16: number;
  readonly 24: number;
  readonly 999: number;
  readonly [key: number]: number;
}

// ---------------------------------------------------------------------------
// Elevation / Shadow
// ---------------------------------------------------------------------------

export interface Elevation {
  readonly none: ViewStyle;
  readonly small: ViewStyle;
  readonly medium: ViewStyle;
  readonly large: ViewStyle;
  readonly extraLarge: ViewStyle;
}

export type ShadowTokens = Elevation;

// ---------------------------------------------------------------------------
// Opacity
// ---------------------------------------------------------------------------

export interface Opacity {
  readonly disabled: number;
  readonly overlay: number;
  readonly pressed: number;
}

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export interface Motion {
  readonly fast: number;
  readonly normal: number;
  readonly slow: number;
}

// ---------------------------------------------------------------------------
// Layout Tokens
// ---------------------------------------------------------------------------

export interface LayoutTokens {
  /** Canonical mobile screen horizontal gutter (16pt) */
  readonly screenGutter: number;
  /** Minimum accessible touch target (44x44pt) */
  readonly minTouchTarget: number;
  /** Maximum reading width / content constraint */
  readonly maxContentWidth?: number;
}

// ---------------------------------------------------------------------------
// Z-Index
// ---------------------------------------------------------------------------

export interface ZIndex {
  readonly dropdown: number;
  readonly modal: number;
  readonly tooltip: number;
  readonly toast: number;
}

// ---------------------------------------------------------------------------
// Theme Mode
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Canonical Theme Contract: DesignSystemTheme
// ---------------------------------------------------------------------------

export interface DesignSystemTheme {
  readonly mode: ThemeMode;
  readonly isDark: boolean;
  readonly colors: SemanticColors;
  readonly feedback: SemanticFeedbackTokens;
  readonly typography: Typography;
  readonly spacing: Spacing;
  readonly radius: Radius;
  readonly elevation: Elevation;
  readonly shadow?: Elevation;
  readonly motion: Motion;
  readonly opacity: Opacity;
  readonly zIndex: ZIndex;
  readonly layout?: LayoutTokens;
  readonly domain?: LxpDomainTokens;

  // Optional top-level aliases for backward compatibility if accessed directly
  readonly background?: string;
  readonly surface?: string;
  readonly surfaceElevated?: string;
  readonly surfaceMuted?: string;
  readonly border?: string;
  readonly borderStrong?: string;
  readonly text?: string;
  readonly textMuted?: string;
  readonly textDisabled?: string;
  readonly primary?: string;
  readonly primaryPressed?: string;
  readonly primaryForeground?: string;
  readonly primaryTint?: string;
  readonly success?: ColorFeedbackRamp;
  readonly warning?: ColorFeedbackRamp;
  readonly error?: ColorFeedbackRamp;
  readonly info?: ColorFeedbackRamp;
}

// ---------------------------------------------------------------------------
// Backward-compatible Theme Aliases
// ---------------------------------------------------------------------------

export type FeedbackColorRamp = ColorFeedbackRamp;
export type FeedbackColors = SemanticFeedbackTokens;
export type TypographyScaleItem = TypographyStyle;

export type TypographyTier =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLg'
  | 'body'
  | 'sm';

export type LegacyTypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'caption'
  | 'overline';

export type TypographyVariant = TypographyTier | LegacyTypographyVariant;

/**
 * Backward compatibility type for existing themes prior to full DesignSystemTheme migration.
 */
export interface LegacyDesignSystem {
  readonly colors: SemanticColors;
  readonly typography: Typography;
  readonly spacing: Spacing;
  readonly radius: Radius;
  readonly elevation: Elevation;
  readonly opacity: Opacity;
  readonly motion: Motion;
  readonly zIndex: ZIndex;

  readonly mode?: ThemeMode;
  readonly background?: string;
  readonly surface?: string;
  readonly surfaceElevated?: string;
  readonly surfaceMuted?: string;
  readonly border?: string;
  readonly borderStrong?: string;
  readonly text?: string;
  readonly textMuted?: string;
  readonly textDisabled?: string;
  readonly primary?: string;
  readonly primaryPressed?: string;
  readonly primaryForeground?: string;
  readonly primaryTint?: string;
  readonly success?: ColorFeedbackRamp;
  readonly warning?: ColorFeedbackRamp;
  readonly error?: ColorFeedbackRamp;
  readonly info?: ColorFeedbackRamp;
  readonly domain?: LxpDomainTokens;
  readonly shadow?: Elevation;
  readonly layout?: LayoutTokens;
}

/**
 * Backward-compatible type alias.
 * Allows gradual transition from legacy theme shape to the canonical DesignSystemTheme.
 */
export type DesignSystem = DesignSystemTheme | LegacyDesignSystem;

export type Theme = DesignSystemTheme;
export type AppTheme = DesignSystemTheme;
export type Shadow = Elevation;
