import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Insets,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  type TouchableOpacityInstance,
  View,
  ViewStyle,
} from 'react-native';
import { useThemedStyles, useTheme } from '@/shared/theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'solid';
export type AppButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
export type AppButtonIconPosition = 'left' | 'right';

export interface AppButtonProps extends Omit<TouchableOpacityProps, 'children' | 'style'> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: AppButtonIconPosition;
  fullWidth?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hitSlop?: Insets | number;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  activeOpacity?: number;
}

const HIT_SLOP_SM: Insets = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};

function normalizeVariant(
  variant: AppButtonVariant = 'primary',
): 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' {
  if (variant === 'solid') return 'primary';
  return variant;
}

function normalizeSize(size: AppButtonSize = 'md'): 'sm' | 'md' | 'lg' {
  if (size === 'small') return 'sm';
  if (size === 'medium') return 'md';
  if (size === 'large') return 'lg';
  return size;
}

export const AppButton = React.forwardRef<TouchableOpacityInstance, AppButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      onPress,
      children,
      style,
      textStyle,
      hitSlop,
      activeOpacity = 0.7,
      accessibilityLabel,
      accessibilityState,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const normalizedVariant = normalizeVariant(variant);
    const normalizedSize = normalizeSize(size);
    const isDisabled = Boolean(disabled || loading);

    const getTextColor = (): string => {
      switch (normalizedVariant) {
        case 'primary':
          return theme.colors.white;
        case 'secondary':
          return theme.colors.text;
        case 'outline':
          return theme.colors.primary;
        case 'ghost':
          return theme.colors.primary;
        case 'danger':
          return theme.colors.white;
        default:
          return theme.colors.white;
      }
    };

    const textColor = getTextColor();

    const styles = useThemedStyles((t) => {
      const sp1 = t.spacing[1] ?? 4;
      const sp2 = t.spacing[2] ?? 8;
      const sp3 = t.spacing[3] ?? 12;
      const sp4 = t.spacing[4] ?? 16;
      const sp6 = t.spacing[6] ?? 24;
      const sp8 = t.spacing[8] ?? 32;
      const sp12 = t.spacing[12] ?? 48;

      return {
        base: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        fullWidth: {
          width: '100%',
          alignSelf: 'stretch',
        },
        // Sizes
        sizeSm: {
          minHeight: sp8, // 32
          paddingVertical: sp1, // 4
          paddingHorizontal: sp3, // 12
          borderRadius: t.radius.sm, // 4
        },
        sizeMd: {
          minHeight: sp8 + sp3, // 44 (minTouchTarget)
          paddingVertical: sp2, // 8
          paddingHorizontal: sp4, // 16
          borderRadius: t.radius.md, // 8
        },
        sizeLg: {
          minHeight: sp12 + sp1, // 52
          paddingVertical: sp3, // 12
          paddingHorizontal: sp6, // 24
          borderRadius: t.radius.md, // 8
        },
        // Variants
        variantPrimary: {
          backgroundColor: t.colors.primary,
          borderColor: t.colors.transparent,
          borderWidth: 1,
        },
        variantSecondary: {
          backgroundColor: t.colors.surfaceVariant,
          borderColor: t.colors.border,
          borderWidth: 1,
        },
        variantOutline: {
          backgroundColor: t.colors.transparent,
          borderColor: t.colors.primary,
          borderWidth: 1,
        },
        variantGhost: {
          backgroundColor: t.colors.transparent,
          borderColor: t.colors.transparent,
          borderWidth: 1,
        },
        variantDanger: {
          backgroundColor: t.colors.error,
          borderColor: t.colors.transparent,
          borderWidth: 1,
        },
        // Text styling
        textBase: {
          textAlign: 'center',
        },
        textSm: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '600',
        },
        textMd: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '600',
        },
        textLg: {
          fontSize: 16,
          lineHeight: 24,
          fontWeight: '600',
        },
        disabled: {
          opacity: t.opacity.disabled,
        },
        iconLeft: {
          marginRight: sp2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconRight: {
          marginLeft: sp2,
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    });

    const getVariantStyle = () => {
      switch (normalizedVariant) {
        case 'secondary':
          return styles.variantSecondary;
        case 'outline':
          return styles.variantOutline;
        case 'ghost':
          return styles.variantGhost;
        case 'danger':
          return styles.variantDanger;
        case 'primary':
        default:
          return styles.variantPrimary;
      }
    };

    const getSizeStyle = () => {
      switch (normalizedSize) {
        case 'sm':
          return styles.sizeSm;
        case 'lg':
          return styles.sizeLg;
        case 'md':
        default:
          return styles.sizeMd;
      }
    };

    const getTextSizeStyle = () => {
      switch (normalizedSize) {
        case 'sm':
          return styles.textSm;
        case 'lg':
          return styles.textLg;
        case 'md':
        default:
          return styles.textMd;
      }
    };

    const resolvedHitSlop =
      hitSlop !== undefined ? hitSlop : normalizedSize === 'sm' ? HIT_SLOP_SM : undefined;

    const defaultAccessibilityLabel =
      accessibilityLabel ?? (typeof children === 'string' ? children : undefined);

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={activeOpacity}
        disabled={isDisabled}
        onPress={onPress}
        hitSlop={resolvedHitSlop}
        accessibilityRole="button"
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityState={{
          disabled: isDisabled,
          busy: Boolean(loading),
          ...accessibilityState,
        }}
        style={[
          styles.base,
          getSizeStyle(),
          getVariantStyle(),
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' ? (
              <View style={styles.iconLeft}>{icon}</View>
            ) : null}
            {typeof children === 'string' ? (
              <Text
                style={[
                  styles.textBase,
                  getTextSizeStyle(),
                  { color: textColor },
                  textStyle,
                ]}
                numberOfLines={1}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {icon && iconPosition === 'right' ? (
              <View style={styles.iconRight}>{icon}</View>
            ) : null}
          </>
        )}
      </TouchableOpacity>
    );
  },
);

AppButton.displayName = 'AppButton';
