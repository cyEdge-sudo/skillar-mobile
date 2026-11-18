import { fontFamilies } from '../tokens/font-families';
import { fontSizes } from '../tokens/font-sizes';
import { fontWeights } from '../tokens/font-weights';
import { letterSpacing } from '../tokens/letter-spacing';
import { lineHeights } from '../tokens/line-heights';
import type { Typography } from '../types';

export const typography: Typography = {
  // -----------------------------------------------------------------------
  // Mobile-Calibrated 8-Tier Typography Scale (Spec v1.0)
  // -----------------------------------------------------------------------
  display: {
    fontFamily: fontFamilies.medium,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '500',
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamilies.semibold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.semibold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: letterSpacing.normal,
  },
  bodyLg: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: letterSpacing.normal,
  },
  sm: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: letterSpacing.normal,
  },

  // -----------------------------------------------------------------------
  // Extended Typography Styles (Backwards compatibility)
  // -----------------------------------------------------------------------
  displayLarge: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes[48],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[56],
    letterSpacing: letterSpacing.tighter,
  },
  displayMedium: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes[36],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[44],
    letterSpacing: letterSpacing.tighter,
  },
  displaySmall: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes[32],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[40],
    letterSpacing: letterSpacing.tight,
  },

  headlineLarge: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes[28],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[36],
    letterSpacing: letterSpacing.tight,
  },
  headlineMedium: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes[24],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[32],
    letterSpacing: letterSpacing.normal,
  },
  headlineSmall: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes[20],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[28],
    letterSpacing: letterSpacing.normal,
  },

  titleLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[18],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[26],
    letterSpacing: letterSpacing.normal,
  },
  titleMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[16],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[24],
    letterSpacing: letterSpacing.normal,
  },
  titleSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[14],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[20],
    letterSpacing: letterSpacing.normal,
  },

  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes[16],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[24],
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[20],
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[18],
    letterSpacing: letterSpacing.normal,
  },

  labelLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[14],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[20],
    letterSpacing: letterSpacing.wide,
  },
  labelMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[12],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[16],
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes[10],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[14],
    letterSpacing: letterSpacing.wider,
  },

  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[16],
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes[10],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[14],
    letterSpacing: letterSpacing.widest,
  },
};
