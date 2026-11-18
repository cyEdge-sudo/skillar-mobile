import { elevation } from '../tokens/elevation';
import { motion } from '../tokens/motion';
import { opacity } from '../tokens/opacity';
import { palette } from '../tokens/palette';
import { radius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { zIndex } from '../tokens/z-index';
import type { DesignSystemTheme, FeedbackColors, SemanticColors } from '../types';
import { typography } from './typography';

const darkFeedback: FeedbackColors = {
  success: {
    signal: palette.feedback.success.dark.signal,
    surface: palette.feedback.success.dark.surface,
    border: palette.feedback.success.dark.border,
  },
  warning: {
    signal: palette.feedback.warning.dark.signal,
    surface: palette.feedback.warning.dark.surface,
    border: palette.feedback.warning.dark.border,
  },
  error: {
    signal: palette.feedback.error.dark.signal,
    surface: palette.feedback.error.dark.surface,
    border: palette.feedback.error.dark.border,
  },
  info: {
    signal: palette.feedback.info.dark.signal,
    surface: palette.feedback.info.dark.surface,
    border: palette.feedback.info.dark.border,
  },
};

const darkColors: SemanticColors = {
  // Theme Mapping (Canonical tokens)
  background: palette.dark.background,
  surface: palette.dark.surface,
  surfaceElevated: palette.dark.surfaceElevated,
  surfaceMuted: palette.dark.surfaceMuted,
  text: palette.dark.text,
  textMuted: palette.dark.textMuted,
  textDisabled: palette.dark.textDisabled,
  border: palette.dark.border,
  borderStrong: palette.dark.borderStrong,
  primary: palette.dark.primary,
  primaryPressed: palette.dark.primaryPressed,
  primaryForeground: palette.dark.primaryForeground,
  primaryTint: palette.dark.primaryTint,

  // Semantic Feedback Ramps (WCAG AA Compliant)
  feedback: darkFeedback,

  // Convenience feedback signal shortcuts
  success: darkFeedback.success.signal,
  warning: darkFeedback.warning.signal,
  error: darkFeedback.error.signal,
  info: darkFeedback.info.signal,

  // Convenience feedback surfaces & borders
  successSurface: darkFeedback.success.surface,
  successBorder: darkFeedback.success.border,
  warningSurface: darkFeedback.warning.surface,
  warningBorder: darkFeedback.warning.border,
  errorSurface: darkFeedback.error.surface,
  errorBorder: darkFeedback.error.border,
  infoSurface: darkFeedback.info.surface,
  infoBorder: darkFeedback.info.border,

  // Backward compatibility aliases
  secondary: palette.dark.primaryPressed,
  surfaceVariant: palette.dark.surfaceElevated,
  textSecondary: palette.dark.textMuted,
  divider: palette.dark.border,
  overlay: palette.dark.overlay,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

export const darkTheme: DesignSystemTheme = {
  mode: 'dark',
  isDark: true,
  colors: darkColors,
  feedback: darkFeedback,
  typography,
  spacing,
  radius,
  elevation,
  shadow: elevation,
  opacity,
  motion,
  zIndex,
};
