import React from 'react';
import {
  Platform,
  Pressable,
  type StyleProp,
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme, useThemedStyles } from '@/shared/theme';

export interface AppSwitchProps extends Omit<RNSwitchProps, 'style'> {
  /** Label rendered alongside the switch */
  label?: string;
  /** Secondary description text rendered under the label */
  description?: string;
  /** Position of the label relative to the switch ('left' | 'right'). Defaults to 'left'. */
  labelPosition?: 'left' | 'right';
  /** Custom style for the outer container/row */
  style?: StyleProp<ViewStyle>;
  /** Custom style for the switch itself */
  switchStyle?: StyleProp<ViewStyle>;
  /** Custom style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Custom style for the description text */
  descriptionStyle?: StyleProp<TextStyle>;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({
  value = false,
  onValueChange,
  disabled = false,
  label,
  description,
  labelPosition = 'left',
  trackColor,
  thumbColor,
  ios_backgroundColor,
  style,
  switchStyle,
  labelStyle,
  descriptionStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...restProps
}) => {
  const theme = useTheme();

  const styles = useThemedStyles((t) => {
    const textMuted = t.colors.textMuted ?? t.colors.textSecondary;
    const surfaceMuted = t.colors.surfaceMuted ?? t.colors.surfaceVariant;

    return {
      rowContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        minHeight: 44,
        paddingVertical: t.spacing[1],
      },
      rowReversed: {
        flexDirection: 'row-reverse' as const,
        justifyContent: 'flex-end' as const,
      },
      standaloneContainer: {
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      labelWrapper: {
        flex: 1,
        justifyContent: 'center' as const,
      },
      labelWrapperReversed: {
        marginLeft: t.spacing[3],
      },
      labelWrapperDefault: {
        marginRight: t.spacing[3],
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
      switchMutedTrack: {
        color: surfaceMuted,
      },
      switchPrimaryThumb: {
        color: t.colors.primaryForeground ?? t.colors.white,
      },
    };
  });

  const resolvedTrackColor = {
    true: trackColor?.true ?? theme.colors.primary,
    false: trackColor?.false ?? styles.switchMutedTrack.color,
  };

  const resolvedThumbColor =
    thumbColor ??
    (Platform.OS === 'android'
      ? value
        ? theme.colors.primary
        : theme.colors.surface
      : undefined);

  const resolvedIosBgColor = ios_backgroundColor ?? styles.switchMutedTrack.color;

  const handleRowPress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  const effectiveAccessibilityLabel =
    accessibilityLabel ?? label ?? (value ? 'On' : 'Off');
  const effectiveAccessibilityHint =
    accessibilityHint ?? (value ? 'Double tap to turn off' : 'Double tap to turn on');

  const switchElement = (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={resolvedTrackColor}
      thumbColor={resolvedThumbColor}
      ios_backgroundColor={resolvedIosBgColor}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={effectiveAccessibilityLabel}
      accessibilityHint={effectiveAccessibilityHint}
      testID={testID ? `${testID}-switch` : undefined}
      style={switchStyle}
      {...restProps}
    />
  );

  const hasLabelContent = Boolean(label || description);

  if (!hasLabelContent) {
    return (
      <View style={[styles.standaloneContainer, style]} testID={testID}>
        {switchElement}
      </View>
    );
  }

  const isReversed = labelPosition === 'right';

  return (
    <Pressable
      onPress={handleRowPress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={effectiveAccessibilityLabel}
      accessibilityHint={effectiveAccessibilityHint}
      style={({ pressed }) => [
        styles.rowContainer,
        isReversed && styles.rowReversed,
        pressed && !disabled && { opacity: theme.opacity.pressed },
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.labelWrapper,
          isReversed ? styles.labelWrapperReversed : styles.labelWrapperDefault,
        ]}
      >
        {label ? (
          <Text style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
            {label}
          </Text>
        ) : null}
        {description ? (
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        ) : null}
      </View>

      {switchElement}
    </Pressable>
  );
};

AppSwitch.displayName = 'AppSwitch';
