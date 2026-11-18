import React, { forwardRef, useState } from 'react';
import {
  type Insets,
  NativeSyntheticEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme, useThemedStyles } from '@/shared/theme';

export interface AppTextInputProps extends RNTextInputProps {
  /** Optional field label rendered above the input */
  label?: string;
  /** Error message string. Triggers error border & text styles */
  error?: string;
  /** Helper/caption text rendered below the input when no error */
  helperText?: string;
  /** Element placed inside the input box on the left (e.g. search icon) */
  leftIcon?: React.ReactNode;
  /** Element placed inside the input box on the right (e.g. eye toggle, action button) */
  rightAction?: React.ReactNode;
  /** Whether to show a clear button when input has text */
  clearable?: boolean;
  /** Callback invoked when clear button is pressed */
  onClear?: () => void;
  /** Optional custom style for the outer container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Optional custom style for the input box wrapper */
  inputContainerStyle?: StyleProp<ViewStyle>;
  /** Optional custom style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Optional custom style for the error text */
  errorStyle?: StyleProp<TextStyle>;
  /** Optional custom style for the helper text */
  helperStyle?: StyleProp<TextStyle>;
  /** Test identifier */
  testID?: string;
}

const HIT_SLOP_CLEAR: Insets = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

function ClearIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12 4L4 12M4 4L12 12"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const AppTextInput = forwardRef<any, AppTextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightAction,
      clearable = false,
      onClear,
      containerStyle,
      inputContainerStyle,
      labelStyle,
      errorStyle,
      helperStyle,
      value,
      onChangeText,
      onFocus,
      onBlur,
      placeholder,
      placeholderTextColor,
      editable = true,
      multiline = false,
      style,
      accessibilityLabel,
      testID,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const styles = useThemedStyles((t) => {
      const errorBorder = t.colors.feedback?.error.border ?? t.colors.error;
      const errorSignal = t.colors.feedback?.error.signal ?? t.colors.error;
      const focusBorder = t.colors.borderStrong ?? t.colors.primary;
      const textMuted = t.colors.textMuted ?? t.colors.textSecondary;
      const surfaceMuted = t.colors.surfaceMuted ?? t.colors.surfaceVariant;

      return {
        container: {
          width: '100%',
        },
        label: {
          fontFamily: t.typography.sm.fontFamily ?? t.typography.body.fontFamily,
          fontSize: t.typography.sm.fontSize,
          lineHeight: t.typography.sm.lineHeight,
          fontWeight: '600' as const,
          color: t.colors.text,
          marginBottom: t.spacing[1],
        },
        inputWrapper: {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          minHeight: 48,
          borderWidth: 1,
          borderColor: t.colors.border,
          borderRadius: t.radius.md ?? t.radius[8] ?? 8,
          backgroundColor: t.colors.surface,
          paddingHorizontal: t.spacing[3],
        },
        inputWrapperMultiline: {
          minHeight: 88,
          alignItems: 'flex-start' as const,
          paddingVertical: t.spacing[2],
        },
        inputWrapperFocused: {
          borderColor: focusBorder,
          borderWidth: 1.5,
        },
        inputWrapperError: {
          borderColor: errorBorder,
          borderWidth: 1.5,
        },
        inputWrapperDisabled: {
          backgroundColor: surfaceMuted,
          borderColor: t.colors.border,
          opacity: t.opacity.disabled,
        },
        input: {
          flex: 1,
          minHeight: 48,
          paddingVertical: t.spacing[2],
          paddingHorizontal: t.spacing[1],
          fontFamily: t.typography.bodyLg?.fontFamily ?? t.typography.body.fontFamily,
          fontSize: t.typography.bodyLg?.fontSize ?? 16,
          lineHeight: t.typography.bodyLg?.lineHeight ?? 22,
          color: t.colors.text,
        },
        inputMultiline: {
          minHeight: 72,
          textAlignVertical: 'top' as const,
        },
        inputDisabled: {
          color: t.colors.textDisabled,
        },
        leftSlot: {
          marginRight: t.spacing[2],
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        },
        rightSlot: {
          marginLeft: t.spacing[2],
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        },
        clearButton: {
          width: 24,
          height: 24,
          borderRadius: t.radius.full ?? 9999,
          backgroundColor: surfaceMuted,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          marginLeft: t.spacing[1],
        },
        helperText: {
          fontFamily: t.typography.sm.fontFamily,
          fontSize: t.typography.sm.fontSize,
          lineHeight: t.typography.sm.lineHeight,
          color: textMuted,
          marginTop: t.spacing[1],
        },
        errorText: {
          fontFamily: t.typography.sm.fontFamily,
          fontSize: t.typography.sm.fontSize,
          lineHeight: t.typography.sm.lineHeight,
          color: errorSignal,
          marginTop: t.spacing[1],
        },
        iconColor: {
          color: textMuted,
        },
      };
    });

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = () => {
      onChangeText?.('');
      onClear?.();
    };

    const hasError = Boolean(error);
    const isDisabled = !editable;
    const showClearButton = Boolean(clearable && value && value.length > 0 && !isDisabled);
    const resolvedPlaceholderColor =
      placeholderTextColor ?? theme.colors.textMuted ?? theme.colors.textSecondary;

    const computedAccessibilityLabel =
      accessibilityLabel ?? (label ? (hasError ? `${label}, error: ${error}` : label) : undefined);

    return (
      <View style={[styles.container, containerStyle]} testID={testID}>
        {label ? (
          <Text style={[styles.label, labelStyle]} nativeID={testID ? `${testID}-label` : undefined}>
            {label}
          </Text>
        ) : null}

        <View
          style={[
            styles.inputWrapper,
            multiline && styles.inputWrapperMultiline,
            isFocused && styles.inputWrapperFocused,
            hasError && styles.inputWrapperError,
            isDisabled && styles.inputWrapperDisabled,
            inputContainerStyle,
          ]}
        >
          {leftIcon ? <View style={styles.leftSlot}>{leftIcon}</View> : null}

          <RNTextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={resolvedPlaceholderColor}
            editable={!isDisabled}
            multiline={multiline}
            style={[
              styles.input,
              multiline && styles.inputMultiline,
              isDisabled && styles.inputDisabled,
              style,
            ]}
            accessibilityLabel={computedAccessibilityLabel}
            accessibilityState={{ disabled: isDisabled }}
            accessibilityLiveRegion={hasError ? 'polite' : 'none'}
            {...restProps}
          />

          {showClearButton ? (
            <Pressable
              onPress={handleClear}
              hitSlop={HIT_SLOP_CLEAR}
              accessibilityRole="button"
              accessibilityLabel="Clear text"
              accessibilityHint="Clears the text input"
              style={styles.clearButton}
            >
              <ClearIcon color={styles.iconColor.color} />
            </Pressable>
          ) : null}

          {rightAction ? <View style={styles.rightSlot}>{rightAction}</View> : null}
        </View>

        {hasError ? (
          <Text
            style={[styles.errorText, errorStyle]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        ) : helperText ? (
          <Text style={[styles.helperText, helperStyle]}>{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

AppTextInput.displayName = 'AppTextInput';
