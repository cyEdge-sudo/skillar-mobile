import React from 'react';
import {
  type Insets,
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme, useThemedStyles } from '@/shared/theme';

export interface AppCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback triggered when checked state changes */
  onChange: (checked: boolean) => void;
  /** Primary label text rendered beside the checkbox */
  label?: string;
  /** Secondary descriptive text rendered under the label */
  description?: string;
  /** Optional error message */
  error?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Custom touch hit slop (defaults to ensuring >= 44x44pt touch target) */
  hitSlop?: Insets | number;
  /** Custom style for the outer container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for the checkbox box */
  checkboxStyle?: StyleProp<ViewStyle>;
  /** Custom style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Custom style for the description text */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Accessibility hint override */
  accessibilityHint?: string;
  /** Test identifier */
  testID?: string;
}

const DEFAULT_STANDALONE_HIT_SLOP: Insets = {
  top: 11,
  bottom: 11,
  left: 11,
  right: 11,
};

function CheckmarkIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M2.5 7.2L5.5 10.2L11.5 3.8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  error,
  disabled = false,
  hitSlop,
  style,
  checkboxStyle,
  labelStyle,
  descriptionStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const theme = useTheme();

  const styles = useThemedStyles((t) => {
    const errorSignal = t.colors.feedback?.error.signal ?? t.colors.error;
    const borderDefault = t.colors.borderStrong ?? t.colors.border;
    const textMuted = t.colors.textMuted ?? t.colors.textSecondary;
    const surfaceMuted = t.colors.surfaceMuted ?? t.colors.surfaceVariant;
    const checkmarkColor = t.colors.primaryForeground ?? t.colors.white;

    return {
      rowContainer: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        minHeight: 44,
        paddingVertical: t.spacing[1],
      },
      standaloneContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      box: {
        width: 22,
        height: 22,
        borderRadius: t.radius.sm ?? 4,
        borderWidth: 1.5,
        borderColor: borderDefault,
        backgroundColor: t.colors.surface,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      boxChecked: {
        borderColor: t.colors.primary,
        backgroundColor: t.colors.primary,
      },
      boxError: {
        borderColor: errorSignal,
      },
      boxDisabled: {
        borderColor: t.colors.border,
        backgroundColor: surfaceMuted,
        opacity: t.opacity.disabled,
      },
      boxDisabledChecked: {
        borderColor: t.colors.textDisabled,
        backgroundColor: t.colors.textDisabled,
        opacity: t.opacity.disabled,
      },
      labelWrapper: {
        flex: 1,
        marginLeft: t.spacing[3],
        justifyContent: 'center' as const,
      },
      label: {
        fontFamily: t.typography.body.fontFamily,
        fontSize: t.typography.body.fontSize,
        lineHeight: t.typography.body.lineHeight,
        color: t.colors.text,
      },
      labelDisabled: {
        color: t.colors.textDisabled,
      },
      description: {
        fontFamily: t.typography.sm.fontFamily,
        fontSize: t.typography.sm.fontSize,
        lineHeight: t.typography.sm.lineHeight,
        color: textMuted,
        marginTop: t.spacing[0] ?? 2,
      },
      errorText: {
        fontFamily: t.typography.sm.fontFamily,
        fontSize: t.typography.sm.fontSize,
        lineHeight: t.typography.sm.lineHeight,
        color: errorSignal,
        marginTop: t.spacing[1],
      },
      checkmarkColor: {
        color: checkmarkColor,
      },
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const hasLabelOrContent = Boolean(label || description || error);
  const effectiveHitSlop = hitSlop ?? (hasLabelOrContent ? undefined : DEFAULT_STANDALONE_HIT_SLOP);
  const effectiveAccessibilityLabel = accessibilityLabel ?? label ?? (checked ? 'Checked' : 'Unchecked');
  const effectiveAccessibilityHint =
    accessibilityHint ?? (checked ? 'Double tap to uncheck' : 'Double tap to check');

  const renderBox = () => (
    <View
      style={[
        styles.box,
        checked && styles.boxChecked,
        error && styles.boxError,
        disabled && (checked ? styles.boxDisabledChecked : styles.boxDisabled),
        checkboxStyle,
      ]}
    >
      {checked ? <CheckmarkIcon color={styles.checkmarkColor.color} /> : null}
    </View>
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={effectiveHitSlop}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={effectiveAccessibilityLabel}
      accessibilityHint={effectiveAccessibilityHint}
      style={({ pressed }) => [
        hasLabelOrContent ? styles.rowContainer : styles.standaloneContainer,
        pressed && !disabled && { opacity: theme.opacity.pressed },
        style,
      ]}
      testID={testID}
    >
      {renderBox()}

      {hasLabelOrContent ? (
        <View style={styles.labelWrapper}>
          {label ? (
            <Text style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
              {label}
            </Text>
          ) : null}
          {description ? (
            <Text style={[styles.description, descriptionStyle]}>{description}</Text>
          ) : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
};

AppCheckbox.displayName = 'AppCheckbox';
