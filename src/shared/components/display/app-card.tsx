import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
  type GestureResponderEvent,
} from 'react-native';

import { useTheme, useThemedStyles } from '@/shared/theme';

export type AppCardVariant = 'default' | 'elevated' | 'muted' | 'outline' | 'outlined';
export type AppCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface AppCardProps extends Omit<ViewProps, 'style'> {
  /**
   * Visual style variant of the card:
   * - `default`: Standard card with surface background and hairline border
   * - `elevated`: Elevated card with shadow and tone stepping in dark mode
   * - `muted`: Recessed container with muted surface background
   * - `outline`: Transparent container with hairline border ('outlined' supported as alias)
   * @default 'default'
   */
  variant?: AppCardVariant;

  /**
   * Internal padding mapped to design tokens:
   * - `none`: 0px
   * - `sm`: 8px
   * - `md`: 16px
   * - `lg`: 24px
   * @default 'md'
   */
  padding?: AppCardPadding;

  /**
   * Optional press handler. When provided, renders as an interactive Pressable with accessibility role "button".
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Active opacity when pressed on non-Android platforms (defaults to theme.opacity.pressed, i.e. 0.7).
   * @default 0.7
   */
  activeOpacity?: number;

  /**
   * Whether the interactive card is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Content inside the card.
   */
  children?: React.ReactNode;
}

export const AppCard = React.forwardRef<any, AppCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      onPress,
      activeOpacity,
      disabled = false,
      accessibilityRole,
      accessibilityState,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();

    const styles = useThemedStyles((t) => {
      const isDark = t.mode === 'dark' || t.colors.surface === '#111827';
      const elevatedBg = isDark
        ? (t.colors.surfaceElevated ?? t.colors.surfaceVariant)
        : t.colors.surface;
      const mutedBg = t.colors.surfaceMuted ?? t.colors.surfaceVariant;

      return {
        base: {
          borderRadius: t.radius[12],
          borderWidth: 1,
          overflow: 'hidden',
        },
        interactive: {
          minHeight: 44,
          minWidth: 44,
        },
        // Variants
        default: {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.border,
        },
        elevated: {
          backgroundColor: elevatedBg,
          borderColor: t.colors.border,
          ...t.elevation.small,
        },
        muted: {
          backgroundColor: mutedBg,
          borderColor: t.colors.border,
        },
        outline: {
          backgroundColor: t.colors.transparent,
          borderColor: t.colors.border,
        },
        // Paddings
        paddingNone: {
          padding: t.spacing[0],
        },
        paddingSm: {
          padding: t.spacing[8],
        },
        paddingMd: {
          padding: t.spacing[16],
        },
        paddingLg: {
          padding: t.spacing[24],
        },
        disabled: {
          opacity: t.opacity.disabled,
        },
      };
    });

    const paddingKey =
      padding === 'none'
        ? styles.paddingNone
        : padding === 'sm'
          ? styles.paddingSm
          : padding === 'lg'
            ? styles.paddingLg
            : styles.paddingMd;

    const variantStyle =
      variant === 'elevated'
        ? styles.elevated
        : variant === 'muted'
          ? styles.muted
          : variant === 'outline' || variant === 'outlined'
            ? styles.outline
            : styles.default;

    if (onPress) {
      const pressedOpacity = activeOpacity ?? theme.opacity.pressed;

      return (
        <Pressable
          ref={ref}
          onPress={disabled ? undefined : onPress}
          disabled={disabled}
          accessibilityRole={accessibilityRole ?? 'button'}
          accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
          android_ripple={{
            color: theme.colors.border,
            borderless: false,
          }}
          style={({ pressed }) => [
            styles.base,
            styles.interactive,
            variantStyle,
            paddingKey,
            disabled && styles.disabled,
            pressed && Platform.OS !== 'android' && { opacity: pressedOpacity },
            style,
          ]}
          {...rest}
        >
          {children}
        </Pressable>
      );
    }

    return (
      <View
        ref={ref}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        style={[styles.base, variantStyle, paddingKey, disabled && styles.disabled, style]}
        {...rest}
      >
        {children}
      </View>
    );
  },
);

AppCard.displayName = 'AppCard';
