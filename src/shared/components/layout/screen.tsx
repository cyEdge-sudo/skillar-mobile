import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, useThemedStyles } from '@/shared/theme';

export type ScreenState = 'idle' | 'loading' | 'error';

export interface ScreenProps {
  /** Screen content */
  children: ReactNode;
  /** Whether the screen body should scroll vertically. Defaults to false. */
  scroll?: boolean;
  /** Optional top header navigation node (e.g. <AppHeader />) */
  header?: ReactNode;
  /** Optional bottom footer / action bar node */
  footer?: ReactNode;
  /** Async screen state: idle (normal), loading (spinner), or error (error banner/retry). Defaults to 'idle'. */
  state?: ScreenState;
  /**
   * Horizontal content gutter in pixels.
   * Defaults to 16 (standard mobile gutter from design system).
   */
  paddingHorizontal?: number;
  /** Safe area edges to respect. Defaults to ['top', 'left', 'right', 'bottom']. */
  edges?: readonly Edge[];
  /** Style for scrollable content container (when scroll=true) or inner content container (when scroll=false) */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Outer container style override */
  style?: StyleProp<ViewStyle>;

  /** Whether to wrap body in KeyboardAvoidingView. Defaults to true on iOS. */
  keyboardAvoiding?: boolean;
  /** Behavior for KeyboardAvoidingView. Defaults to iOS: 'padding', Android: undefined */
  keyboardBehavior?: 'padding' | 'height' | 'position';
  /** Keyboard vertical offset */
  keyboardVerticalOffset?: number;
  /** Whether keyboard should persist taps on scroll. Defaults to 'handled'. */
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  /** Pull-to-refresh component for scroll view */
  refreshControl?: ScrollViewProps['refreshControl'];
  /** Whether to show vertical scroll indicator. Defaults to true. */
  showsVerticalScrollIndicator?: boolean;

  /** Custom loading component to override default spinner */
  loadingComponent?: ReactNode;
  /** Custom error component to override default error state */
  errorComponent?: ReactNode;
  /** Optional custom error message displayed in default error state */
  errorMessage?: string;
  /** Optional retry callback invoked from default error state */
  onRetry?: () => void;
  /** Background color override (defaults to theme.colors.background) */
  backgroundColor?: string;
  /** Optional testID for testing */
  testID?: string;
  /** Accessibility label for the screen container */
  accessibilityLabel?: string;
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'left', 'right', 'bottom'];
const DEFAULT_GUTTER = 16;
const IS_IOS = Platform.OS === 'ios';

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  header,
  footer,
  state = 'idle',
  paddingHorizontal = DEFAULT_GUTTER,
  edges = DEFAULT_EDGES,
  contentContainerStyle,
  style,
  keyboardAvoiding = IS_IOS,
  keyboardBehavior = IS_IOS ? 'padding' : undefined,
  keyboardVerticalOffset = 0,
  keyboardShouldPersistTaps = 'handled',
  refreshControl,
  showsVerticalScrollIndicator = true,
  loadingComponent,
  errorComponent,
  errorMessage,
  onRetry,
  backgroundColor,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const styles = useThemedStyles((t) => ({
    safeArea: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    headerWrapper: {
      zIndex: 10,
    },
    footerWrapper: {
      zIndex: 10,
    },
    fixedBody: {
      flex: 1,
      paddingHorizontal: DEFAULT_GUTTER,
    },
    scrollBody: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: DEFAULT_GUTTER,
    },
    centerFeedback: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: t.spacing[24] ?? 24,
      paddingVertical: t.spacing[32] ?? 32,
    },
    loadingIndicator: {
      marginVertical: t.spacing[16] ?? 16,
    },
    errorTitle: {
      fontSize: t.typography.titleMedium?.fontSize ?? 18,
      fontWeight: '600',
      lineHeight: t.typography.titleMedium?.lineHeight ?? 24,
      color: t.colors.error,
      textAlign: 'center',
      marginBottom: t.spacing[8] ?? 8,
    },
    errorMessage: {
      fontSize: t.typography.body?.fontSize ?? 14,
      lineHeight: t.typography.body?.lineHeight ?? 20,
      color: t.colors.textSecondary,
      textAlign: 'center',
      marginBottom: t.spacing[20] ?? 20,
    },
    retryButton: {
      minWidth: 120,
      minHeight: 44,
      paddingHorizontal: t.spacing[20] ?? 20,
      paddingVertical: t.spacing[10] ?? 10,
      borderRadius: t.radius[8] ?? 8,
      backgroundColor: t.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    retryButtonPressed: {
      opacity: t.opacity.pressed ?? 0.8,
    },
    retryButtonText: {
      color: t.colors.white ?? '#FFFFFF',
      fontSize: t.typography.body?.fontSize ?? 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  }));

  // Apply custom horizontal padding only when it deviates from the canonical 16px gutter
  const customGutterStyle =
    paddingHorizontal !== DEFAULT_GUTTER ? { paddingHorizontal } : null;

  const renderScreenContent = () => {
    if (state === 'loading') {
      if (loadingComponent) {
        return <View style={[styles.fixedBody, customGutterStyle]}>{loadingComponent}</View>;
      }
      return (
        <View
          style={styles.centerFeedback}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading content"
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loadingIndicator}
          />
        </View>
      );
    }

    if (state === 'error') {
      if (errorComponent) {
        return <View style={[styles.fixedBody, customGutterStyle]}>{errorComponent}</View>;
      }
      return (
        <View
          style={styles.centerFeedback}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {errorMessage ?? 'An unexpected error occurred. Please try again.'}
          </Text>
          {onRetry ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retry action"
              onPress={onRetry}
              style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      );
    }

    if (scroll) {
      return (
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={[
            styles.scrollContent,
            customGutterStyle,
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View
        style={[
          styles.fixedBody,
          customGutterStyle,
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    );
  };

  const bodyContent = renderScreenContent();

  const containerContent = (
    <>
      {header ? <View style={styles.headerWrapper}>{header}</View> : null}
      {bodyContent}
      {footer ? <View style={styles.footerWrapper}>{footer}</View> : null}
    </>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safeArea,
        backgroundColor ? { backgroundColor } : null,
        style,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={styles.keyboardContainer}
        >
          {containerContent}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.keyboardContainer}>{containerContent}</View>
      )}
    </SafeAreaView>
  );
};

Screen.displayName = 'Screen';
