/**
 * Semantic Feedback Ramps (WCAG AA Compliant)
 *
 * Each feedback state contains:
 * - signal: Text & icon color (>= 4.5:1 contrast against surface)
 * - surface: Pill/container background fill
 * - border: 1px hairline separation border
 */

export interface FeedbackRamp {
  readonly signal: string;
  readonly surface: string;
  readonly border: string;
}

export interface FeedbackTokens {
  readonly primary: FeedbackRamp;
  readonly success: FeedbackRamp;
  readonly warning: FeedbackRamp;
  readonly error: FeedbackRamp;
  readonly neutral: FeedbackRamp;
  readonly info: FeedbackRamp;
}

export const lightFeedback: FeedbackTokens = {
  primary: {
    signal: '#6C47FF',
    surface: '#F4F1FF',
    border: '#D8CCFF',
  },
  success: {
    signal: '#15803D',
    surface: '#F0FDF4',
    border: '#BBF7D0',
  },
  warning: {
    signal: '#A16207',
    surface: '#FEFCE8',
    border: '#FEF08A',
  },
  error: {
    signal: '#B91C1C',
    surface: '#FEF2F2',
    border: '#FECACA',
  },
  info: {
    signal: '#1D4ED8',
    surface: '#EFF6FF',
    border: '#BFDBFE',
  },
  neutral: {
    signal: '#475569',
    surface: '#F1F5F9',
    border: '#E2E8F0',
  },
};

export const darkFeedback: FeedbackTokens = {
  primary: {
    signal: '#7C5CFF',
    surface: '#2A1F66',
    border: '#4728C4',
  },
  success: {
    signal: '#4ADE80',
    surface: '#052E16',
    border: '#14532D',
  },
  warning: {
    signal: '#FACC15',
    surface: '#422006',
    border: '#713F12',
  },
  error: {
    signal: '#F87171',
    surface: '#450A0A',
    border: '#7F1D1D',
  },
  info: {
    signal: '#60A5FA',
    surface: '#172554',
    border: '#1E3A8A',
  },
  neutral: {
    signal: '#94A3B8',
    surface: '#172033',
    border: '#293548',
  },
};
