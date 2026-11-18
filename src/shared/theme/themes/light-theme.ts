import { elevation } from '../tokens/elevation';
import { motion } from '../tokens/motion';
import { opacity } from '../tokens/opacity';
import { palette } from '../tokens/palette';
import { radius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { zIndex } from '../tokens/z-index';
import type { DesignSystemTheme, FeedbackColors, SemanticColors } from '../types';
import { typography } from './typography';

const lightFeedback: FeedbackColors = {
  success: {
    signal: palette.feedback.success.light.signal,
    surface: palette.feedback.success.light.surface,
    border: palette.feedback.success.light.border,
  },
  warning: {
    signal: palette.feedback.warning.light.signal,
    surface: palette.feedback.warning.light.surface,
    border: palette.feedback.warning.light.border,
  },
  error: {
    signal: palette.feedback.error.light.signal,
    surface: palette.feedback.error.light.surface,
    border: palette.feedback.error.light.border,
  },
  info: {
    signal: palette.feedback.info.light.signal,
    surface: palette.feedback.info.light.surface,
    border: palette.feedback.info.light.border,
  },
};

const lightColors: SemanticColors = {
  // Theme Mapping (Canonical tokens)
  background: palette.light.background,
  surface: palette.light.surface,
  surfaceElevated: palette.light.surfaceElevated,
  surfaceMuted: palette.light.surfaceMuted,
  text: palette.light.text,
  textMuted: palette.light.textMuted,
  textDisabled: palette.light.textDisabled,
  border: palette.light.border,
  borderStrong: palette.light.borderStrong,
  primary: palette.light.primary,
  primaryPressed: palette.light.primaryPressed,
  primaryForeground: palette.light.primaryForeground,
  primaryTint: palette.light.primaryTint,

  // Semantic Feedback Ramps (WCAG AA Compliant)
  feedback: lightFeedback,

  // Convenience feedback signal shortcuts
  success: lightFeedback.success.signal,
  warning: lightFeedback.warning.signal,
  error: lightFeedback.error.signal,
  info: lightFeedback.info.signal,

  // Convenience feedback surfaces & borders
  successSurface: lightFeedback.success.surface,
  successBorder: lightFeedback.success.border,
  warningSurface: lightFeedback.warning.surface,
  warningBorder: lightFeedback.warning.border,
  errorSurface: lightFeedback.error.surface,
  errorBorder: lightFeedback.error.border,
  infoSurface: lightFeedback.info.surface,
  infoBorder: lightFeedback.info.border,

  // Backward compatibility aliases
  secondary: palette.light.primaryPressed,
  surfaceVariant: palette.light.surfaceElevated,
  textSecondary: palette.light.textMuted,
  divider: palette.light.border,
  overlay: palette.light.overlay,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

export const lightTheme: DesignSystemTheme = {
  mode: 'light',
  isDark: false,
  colors: lightColors,
  feedback: lightFeedback,
  typography,
  spacing,
  radius,
  elevation,
  shadow: elevation,
  opacity,
  motion,
  zIndex,
};
