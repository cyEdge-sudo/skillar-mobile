import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useThemedStyles, type DesignSystem } from '@/shared/theme';

export type AppBadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'neutral'
  | 'default';

export type AppBadgeSize = 'sm' | 'md' | 'lg';

export interface AppBadgeProps extends Omit<ViewProps, 'style'> {
  /**
   * Semantic status variant.
   * Maps directly to WCAG AA compliant semantic feedback ramps.
   * @default 'neutral'
   */
  variant?: AppBadgeVariant;

  /**
   * Size tier controlling padding and font size.
   * @default 'md'
   */
  size?: AppBadgeSize;

  /**
   * Text label content. If omitted, `children` will be rendered.
   */
  label?: string;

  /**
   * Optional leading icon or node.
   */
  icon?: React.ReactNode;

  /**
   * Custom container style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom label text style overrides.
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Children content (text or nodes).
   */
  children?: React.ReactNode;
}

export const AppBadge = React.forwardRef<any, AppBadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      label,
      icon,
      style,
      textStyle,
      children,
      accessibilityLabel,
      ...rest
    },
    ref,
  ) => {
    const styles = useThemedStyles(createStyles);
    const content = label ?? children;
    const resolvedVariant = variant === 'default' ? 'neutral' : variant;

    return (
      <View
        ref={ref}
        style={[
          styles.base,
          styles[resolvedVariant],
          styles[size],
          style,
        ]}
        accessibilityRole="text"
        accessibilityLabel={
          accessibilityLabel ??
          (typeof content === 'string' ? content : undefined)
        }
        {...rest}
      >
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        {typeof content === 'string' ? (
          <Text
            style={[
              styles.textBase,
              styles[`${resolvedVariant}Text`],
              styles[`${size}Text`],
              textStyle,
            ]}
            numberOfLines={1}
          >
            {content}
          </Text>
        ) : (
          content
        )}
      </View>
    );
  },
);

AppBadge.displayName = 'AppBadge';

const createStyles = (theme: DesignSystem) => {
  const { colors, radius, spacing } = theme;

  return StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      borderWidth: 1,
    },
    iconContainer: {
      marginRight: spacing[1],
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Variant containers (WCAG AA Compliant Surface & Border tokens)
    success: {
      backgroundColor: colors.successSurface,
      borderColor: colors.successBorder,
    },
    warning: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.warningBorder,
    },
    error: {
      backgroundColor: colors.errorSurface,
      borderColor: colors.errorBorder,
    },
    info: {
      backgroundColor: colors.infoSurface,
      borderColor: colors.infoBorder,
    },
    primary: {
      backgroundColor: colors.primaryTint,
      borderColor: colors.primary,
    },
    neutral: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },

    // Sizing
    sm: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[0],
      minHeight: 20,
    },
    md: {
      paddingHorizontal: spacing[2] + 2,
      paddingVertical: spacing[1],
      minHeight: 24,
    },
    lg: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1] + 2,
      minHeight: 28,
    },

    // Typography & Signal colors
    textBase: {
      fontWeight: '600',
      textAlign: 'center',
    },
    successText: {
      color: colors.success,
    },
    warningText: {
      color: colors.warning,
    },
    errorText: {
      color: colors.error,
    },
    infoText: {
      color: colors.info,
    },
    primaryText: {
      color: colors.primary,
    },
    neutralText: {
      color: colors.textMuted,
    },

    // Text sizing
    smText: {
      fontSize: 11,
      lineHeight: 14,
    },
    mdText: {
      fontSize: 12,
      lineHeight: 16,
    },
    lgText: {
      fontSize: 13,
      lineHeight: 18,
    },
  });
};
