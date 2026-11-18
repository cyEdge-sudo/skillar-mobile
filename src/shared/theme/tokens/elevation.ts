import { Platform, ViewStyle } from 'react-native';

const none: ViewStyle = Platform.select({
  ios: {},
  android: { elevation: 0 },
  default: {},
}) ?? {};

const lightSmall: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: { elevation: 2 },
  default: {},
}) ?? {};

const lightMedium: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: { elevation: 4 },
  default: {},
}) ?? {};

const lightLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  android: { elevation: 8 },
  default: {},
}) ?? {};

const lightExtraLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  android: { elevation: 16 },
  default: {},
}) ?? {};

export const lightElevation = {
  none,
  small: lightSmall,
  medium: lightMedium,
  large: lightLarge,
  extraLarge: lightExtraLarge,
  sm: lightSmall,
  md: lightMedium,
  lg: lightLarge,
  xl: lightExtraLarge,
} as const;

const darkSmall: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  android: { elevation: 2 },
  default: {},
}) ?? {};

const darkMedium: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
  },
  android: { elevation: 4 },
  default: {},
}) ?? {};

const darkLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 8,
  },
  android: { elevation: 8 },
  default: {},
}) ?? {};

const darkExtraLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.75,
    shadowRadius: 16,
  },
  android: { elevation: 16 },
  default: {},
}) ?? {};

export const darkElevation = {
  none,
  small: darkSmall,
  medium: darkMedium,
  large: darkLarge,
  extraLarge: darkExtraLarge,
  sm: darkSmall,
  md: darkMedium,
  lg: darkLarge,
  xl: darkExtraLarge,
} as const;

/**
 * Default elevation export (light theme baseline for backward compatibility)
 */
export const elevation = lightElevation;

export type ElevationLevel = keyof typeof lightElevation;
