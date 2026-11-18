import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useTheme, type DesignSystem } from '@/shared/theme';
import { AppButton } from '../forms';

export type StateContainerType = 'loading' | 'error' | 'empty';

export interface StateContainerProps extends Omit<ViewProps, 'style'> {
  /**
   * Type of state to display:
   * - `loading`: Centered spinner with loading description
   * - `error`: Error icon, title, description, and retry button
   * - `empty`: Empty state icon, title, description, and action button
   */
  type: StateContainerType;

  /**
   * Primary title text.
   */
  title?: string;

  /**
   * Secondary explanatory message.
   */
  description?: string;

  /**
   * Callback when the retry/action button is pressed.
   * If provided in 'error' or 'empty' states, renders a prominent action button.
   */
  onRetry?: () => void;

  /**
   * Label for the retry/action button.
   * Defaults to 'Try Again' for error states, or 'Refresh' for empty states.
   */
  retryLabel?: string;

  /**
   * Custom icon or visual element. Overrides the default state icon.
   */
  icon?: React.ReactNode;

  /**
   * Custom action component (e.g. secondary button, link).
   * Renders below the description or replaces default retry button.
   */
  action?: React.ReactNode;

  /**
   * Additional child components to render within the state container.
   */
  children?: React.ReactNode;

  /**
   * Outer container style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Inner content container style overrides.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Whether the container expands to fill available flex space.
   * @default true
   */
  fullScreen?: boolean;

  /**
   * Accessibility label override for screen readers.
   */
  accessibilityLabel?: string;

  /**
   * Optional test ID for automation.
   */
  testID?: string;
}

export const StateContainer = React.forwardRef<any, StateContainerProps>(
  (
    {
      type,
      title,
      description,
      onRetry,
      retryLabel,
      icon,
      action,
      children,
      style,
      contentContainerStyle,
      fullScreen = true,
      accessibilityLabel,
      testID,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useThemedStyles(createStyles);

    const defaultTitle =
      title ??
      (type === 'error'
        ? 'Something went wrong'
        : type === 'empty'
          ? 'No items found'
          : undefined);

    const defaultRetryLabel =
      retryLabel ?? (type === 'error' ? 'Try Again' : 'Refresh');

    // Accessibility attributes mapped per state type
    const accessibilityRole =
      type === 'error'
        ? 'alert'
        : type === 'loading'
          ? 'progressbar'
          : 'summary';

    const accessibilityLiveRegion =
      type === 'error' ? 'assertive' : 'polite';

    const resolvedA11yLabel =
      accessibilityLabel ??
      [title ?? defaultTitle, description].filter(Boolean).join('. ');

    const renderDefaultIcon = () => {
      if (icon) {
        return <View style={styles.iconSlot}>{icon}</View>;
      }

      switch (type) {
        case 'loading':
          return (
            <View style={styles.spinnerWrapper}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          );
        case 'error':
          return (
            <View style={styles.errorIconWrapper}>
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={theme.colors.error}
              />
            </View>
          );
        case 'empty':
          return (
            <View style={styles.emptyIconWrapper}>
              <Ionicons
                name="albums-outline"
                size={38}
                color={theme.colors.textMuted}
              />
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          fullScreen && styles.fullScreen,
          style,
        ]}
        accessibilityRole={accessibilityRole}
        accessibilityLiveRegion={accessibilityLiveRegion}
        accessibilityLabel={resolvedA11yLabel}
        testID={testID}
        {...rest}
      >
        <View style={[styles.content, contentContainerStyle]}>
          {renderDefaultIcon()}

          {(defaultTitle || description) && (
            <View style={styles.textContainer}>
              {defaultTitle ? (
                <Text style={styles.title} numberOfLines={2}>
                  {defaultTitle}
                </Text>
              ) : null}
              {description ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}
            </View>
          )}

          {action ? (
            <View style={styles.actionsContainer}>{action}</View>
          ) : onRetry ? (
            <View style={styles.actionsContainer}>
              <AppButton
                variant={type === 'error' ? 'outline' : 'primary'}
                size="md"
                onPress={onRetry}
                accessibilityLabel={defaultRetryLabel}
              >
                {defaultRetryLabel}
              </AppButton>
            </View>
          ) : null}

          {children ? (
            <View style={styles.childrenContainer}>{children}</View>
          ) : null}
        </View>
      </View>
    );
  },
);

StateContainer.displayName = 'StateContainer';

const createStyles = (theme: DesignSystem) => {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.gutter,
      paddingVertical: spacing[8],
      backgroundColor: colors.transparent,
    },
    fullScreen: {
      flex: 1,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 340,
      width: '100%',
    },
    iconSlot: {
      marginBottom: spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinnerWrapper: {
      marginBottom: spacing[4],
      padding: spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorIconWrapper: {
      width: 72,
      height: 72,
      borderRadius: radius.full,
      backgroundColor: colors.errorSurface,
      borderColor: colors.errorBorder,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[4],
    },
    emptyIconWrapper: {
      width: 72,
      height: 72,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[4],
    },
    textContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      width: '100%',
    },
    title: {
      fontSize: typography.h3.fontSize,
      lineHeight: typography.h3.lineHeight,
      fontWeight: typography.h3.fontWeight,
      color: colors.text,
      textAlign: 'center',
    },
    description: {
      fontSize: typography.body.fontSize,
      lineHeight: typography.body.lineHeight,
      fontWeight: typography.body.fontWeight,
      color: colors.textMuted,
      textAlign: 'center',
    },
    actionsContainer: {
      marginTop: spacing[6],
      alignItems: 'center',
      width: '100%',
    },
    childrenContainer: {
      marginTop: spacing[4],
      width: '100%',
    },
  });
};
