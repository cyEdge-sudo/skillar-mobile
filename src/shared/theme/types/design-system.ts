import type { TextStyle, ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Semantic Colors
// ---------------------------------------------------------------------------

export interface SemanticColors {
    readonly primary: string;
    readonly secondary: string;
    readonly background: string;
    readonly surface: string;
    readonly surfaceVariant: string;
    readonly text: string;
    readonly textSecondary: string;
    readonly textDisabled: string;
    readonly border: string;
    readonly divider: string;
    readonly success: string;
    readonly warning: string;
    readonly error: string;
    readonly info: string;
    readonly overlay: string;
    readonly white: string;
    readonly black: string;
    readonly transparent: string;
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

export interface Typography {
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
    readonly 2: number;
    readonly 4: number;
    readonly 8: number;
    readonly 12: number;
    readonly 16: number;
    readonly 20: number;
    readonly 24: number;
    readonly 32: number;
    readonly 40: number;
    readonly 48: number;
    readonly 64: number;
}

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------

export interface Radius {
    readonly 0: number;
    readonly 2: number;
    readonly 4: number;
    readonly 8: number;
    readonly 12: number;
    readonly 16: number;
    readonly 24: number;
    readonly 999: number;
}

// ---------------------------------------------------------------------------
// Elevation
// ---------------------------------------------------------------------------

export interface Elevation {
    readonly none: ViewStyle;
    readonly small: ViewStyle;
    readonly medium: ViewStyle;
    readonly large: ViewStyle;
    readonly extraLarge: ViewStyle;
}

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
// Z-Index
// ---------------------------------------------------------------------------

export interface ZIndex {
    readonly dropdown: number;
    readonly modal: number;
    readonly tooltip: number;
    readonly toast: number;
}

// ---------------------------------------------------------------------------
// Design System (full theme contract)
// ---------------------------------------------------------------------------

export interface DesignSystem {
    readonly colors: SemanticColors;
    readonly typography: Typography;
    readonly spacing: Spacing;
    readonly radius: Radius;
    readonly elevation: Elevation;
    readonly opacity: Opacity;
    readonly motion: Motion;
    readonly zIndex: ZIndex;
}

// ---------------------------------------------------------------------------
// Theme Mode
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';
