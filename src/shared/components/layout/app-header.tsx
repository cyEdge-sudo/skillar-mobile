import React from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme, useThemedStyles } from '@/shared/theme';

export interface AppHeaderProps {
  /** Screen or section title */
  title?: string;
  /** Optional secondary subtitle or breadcrumb */
  subtitle?: string;
  /** Whether to show the back navigation button. Defaults to true if onBack is provided. */
  showBack?: boolean;
  /** Callback triggered when the back button is pressed */
  onBack?: () => void;
  /** Action node rendered on the right side (e.g. icon button, action link, menu) */
  rightAction?: React.ReactNode;
  /** Custom left action node (overrides the back button if provided) */
  leftAction?: React.ReactNode;
  /** Whether header should have transparent background and no hairline border */
  transparent?: boolean;
  /** Title text alignment. Defaults to 'center' on mobile navigation bars. */
  alignTitle?: 'center' | 'left';
  /** Optional color override for icons and text */
  tintColor?: string;
  /** Optional style override for the outer container */
  style?: StyleProp<ViewStyle>;
  /** Optional style override for the title text */
  titleStyle?: StyleProp<TextStyle>;
  /** Optional style override for the subtitle text */
  subtitleStyle?: StyleProp<TextStyle>;
  /** Custom accessibility label for the back button (defaults to "Back") */
  backAccessibilityLabel?: string;
  /** Optional testID for testing */
  testID?: string;
}

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

function ChevronBackIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  rightAction,
  leftAction,
  transparent = false,
  alignTitle = 'center',
  tintColor,
  style,
  titleStyle,
  subtitleStyle,
  backAccessibilityLabel = 'Back',
  testID,
}) => {
  const theme = useTheme();
  const styles = useThemedStyles((t) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 56,
      paddingHorizontal: t.spacing[4],
      backgroundColor: t.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: (t.colors as unknown as Record<string, string>).borderSubtle ?? t.colors.border,
    },
    transparentContainer: {
      backgroundColor: t.colors.transparent,
      borderBottomWidth: 0,
      borderBottomColor: t.colors.transparent,
    },
    leftSlot: {
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
      zIndex: 1,
    },
    centerSlot: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: t.spacing[2],
    },
    centerSlotAlignedCenter: {
      alignItems: 'center',
    },
    centerSlotAlignedLeft: {
      alignItems: 'flex-start',
    },
    rightSlot: {
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: t.radius[8] ?? 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonPressed: {
      opacity: t.opacity.pressed,
      backgroundColor: t.colors.surfaceVariant,
    },
    title: {
      fontFamily: t.typography.titleLarge?.fontFamily ?? t.typography.titleMedium.fontFamily,
      fontSize: t.typography.titleMedium.fontSize,
      fontWeight: '600',
      lineHeight: t.typography.titleMedium.lineHeight,
      color: t.colors.text,
      textAlign: 'center',
    },
    titleLeft: {
      textAlign: 'left',
    },
    subtitle: {
      fontFamily: t.typography.caption.fontFamily,
      fontSize: t.typography.caption.fontSize,
      fontWeight: t.typography.caption.fontWeight,
      lineHeight: t.typography.caption.lineHeight,
      color: t.colors.textSecondary,
      textAlign: 'center',
      marginTop: 1,
    },
    subtitleLeft: {
      textAlign: 'left',
    },
  }));

  const shouldShowBack = showBack ?? Boolean(onBack);
  const iconColor = tintColor ?? theme.colors.text;
  const isCentered = alignTitle === 'center';

  return (
    <View
      style={[styles.container, transparent && styles.transparentContainer, style]}
      accessibilityRole="header"
      testID={testID}
    >
      <View style={styles.leftSlot}>
        {leftAction ? (
          leftAction
        ) : shouldShowBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            accessibilityHint="Navigates to the previous screen"
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <ChevronBackIcon color={iconColor} />
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.centerSlot,
          isCentered ? styles.centerSlotAlignedCenter : styles.centerSlotAlignedLeft,
        ]}
        pointerEvents="box-none"
      >
        {title ? (
          <Text
            style={[
              styles.title,
              !isCentered && styles.titleLeft,
              tintColor ? { color: tintColor } : null,
              titleStyle,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              !isCentered && styles.subtitleLeft,
              tintColor ? { color: tintColor } : null,
              subtitleStyle,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightSlot}>{rightAction ?? null}</View>
    </View>
  );
};

AppHeader.displayName = 'AppHeader';
