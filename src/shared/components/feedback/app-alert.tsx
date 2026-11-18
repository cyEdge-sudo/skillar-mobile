import React from 'react';
import {
  Insets,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useTheme, type DesignSystem } from '@/shared/theme';

export type AppAlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AppAlertProps extends Omit<ViewProps, 'style'> {
  /**
   * Semantic alert tone:
   * - `info`: Informational notice (blue ramp)
   * - `success`: Successful action confirmation (green ramp)
   * - `warning`: Cautionary guidance (amber ramp)
   * - `error`: Error notification (red ramp)
   * @default 'info'
   */
  variant?: AppAlertVariant;

  /**
   * Optional bold title header for the alert.
   */
  title?: string;

  /**
   * Explanatory alert body message.
   */
  message: string;

  /**
   * Custom leading icon. Overrides the variant default icon.
   */
  icon?: React.ReactNode;

  /**
   * Optional dismiss handler. When supplied, displays a 44x44 touch-accessible close button.
   */
  onDismiss?: () => void;

  /**
   * Optional trailing action component or link.
   */
  action?: React.ReactNode;

  /**
   * Outer container style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional automation test ID.
   */
  testID?: string;

  /**
   * Accessibility label override.
   */
  accessibilityLabel?: string;
}

const CLOSE_HIT_SLOP: Insets = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

export const AppAlert = React.forwardRef<any, AppAlertProps>(
  (
    {
      variant = 'info',
      title,
      message,
      icon,
      onDismiss,
      action,
      style,
      testID,
      accessibilityLabel,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useThemedStyles(createStyles);

    // Resolve semantic ramp signal color for default icon
    const getSignalColor = () => {
      switch (variant) {
        case 'success':
          return theme.colors.success;
        case 'warning':
          return theme.colors.warning;
        case 'error':
          return theme.colors.error;
        case 'info':
        default:
          return theme.colors.info;
      }
    };

    const renderDefaultIcon = () => {
      if (icon) {
        return <View style={styles.iconSlot}>{icon}</View>;
      }

      const signalColor = getSignalColor();
      let iconName: keyof typeof Ionicons.glyphMap;

      switch (variant) {
        case 'success':
          iconName = 'checkmark-circle';
          break;
        case 'warning':
          iconName = 'warning';
          break;
        case 'error':
          iconName = 'alert-circle';
          break;
        case 'info':
        default:
          iconName = 'information-circle';
          break;
      }

      return (
        <View style={styles.iconSlot}>
          <Ionicons name={iconName} size={20} color={signalColor} />
        </View>
      );
    };

    const resolvedA11yLabel =
      accessibilityLabel ??
      [title, message].filter(Boolean).join('. ');

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          styles[variant],
          style,
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={resolvedA11yLabel}
        testID={testID}
        {...rest}
      >
        {renderDefaultIcon()}

        <View style={styles.content}>
          {title ? (
            <Text style={[styles.title, styles[`${variant}Title`]]}>
              {title}
            </Text>
          ) : null}
          <Text style={styles.message}>{message}</Text>
          {action ? <View style={styles.actionContainer}>{action}</View> : null}
        </View>

        {onDismiss ? (
          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={CLOSE_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
            style={styles.dismissButton}
            activeOpacity={theme.opacity.pressed}
          >
            <Ionicons
              name="close"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  },
);

AppAlert.displayName = 'AppAlert';

const createStyles = (theme: DesignSystem) => {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRadius: radius.md,
      borderWidth: 1,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      width: '100%',
    },

    // Semantic feedback ramps (Surface & Border)
    info: {
      backgroundColor: colors.infoSurface,
      borderColor: colors.infoBorder,
    },
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

    iconSlot: {
      marginRight: spacing[3],
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: typography.body.fontSize,
      lineHeight: typography.body.lineHeight,
      fontWeight: '600',
      marginBottom: spacing[1] / 2,
    },
    infoTitle: {
      color: colors.info,
    },
    successTitle: {
      color: colors.success,
    },
    warningTitle: {
      color: colors.warning,
    },
    errorTitle: {
      color: colors.error,
    },
    message: {
      fontSize: typography.sm.fontSize,
      lineHeight: typography.sm.lineHeight + 3,
      fontWeight: '400',
      color: colors.text,
    },
    actionContainer: {
      marginTop: spacing[2],
    },
    dismissButton: {
      marginLeft: spacing[2],
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      minHeight: 20,
    },
  });
};
