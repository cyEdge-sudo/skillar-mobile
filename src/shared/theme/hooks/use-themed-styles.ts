import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from './use-theme';
import type { DesignSystem } from '../types';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T> | NamedStyles<any>>(
  stylesFactory: (theme: DesignSystem) => T
): T {
  const theme = useTheme();
  return useMemo(() => StyleSheet.create(stylesFactory(theme)), [theme]);
}
