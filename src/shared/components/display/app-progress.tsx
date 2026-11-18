import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  View,
  ViewProps,
  type ViewInstance,
  ViewStyle,
} from 'react-native';
import { useThemedStyles } from '@/shared/theme';

export type AppProgressVariant = 'primary' | 'success' | 'warning' | 'error';
export type AppProgressSize = 'sm' | 'md' | 'lg';

export interface AppProgressProps extends Omit<ViewProps, 'children'> {
  /**
   * Progress value from 0 to 100.
   */
  value?: number;
  /**
   * Backward-compatible progress prop (0-1 or 0-100).
   */
  progress?: number;
  /**
   * Semantic color variant.
   * @default 'primary'
   */
  variant?: AppProgressVariant;
  /**
   * Size tier controlling the track height.
   * @default 'md'
   */
  size?: AppProgressSize;
  /**
   * Custom track background color override.
   */
  trackColor?: string;
  /**
   * Custom fill color override.
   */
  color?: string;
  /**
   * Whether to animate progress transitions.
   * @default true
   */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppProgress = React.forwardRef<ViewInstance, AppProgressProps>(
  (
    {
      value,
      progress,
      variant = 'primary',
      size = 'md',
      trackColor,
      color,
      animated = true,
      style,
      accessibilityLabel,
      accessibilityValue,
      ...rest
    },
    ref,
  ) => {
    const rawValue =
      value !== undefined
        ? value
        : progress !== undefined
          ? progress <= 1 && progress > 0
            ? progress * 100
            : progress
          : 0;
    const clamped = Math.min(100, Math.max(0, isNaN(rawValue) ? 0 : rawValue));

    const animValue = useRef(new Animated.Value(clamped)).current;

    useEffect(() => {
      if (animated) {
        Animated.timing(animValue, {
          toValue: clamped,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        animValue.setValue(clamped);
      }
    }, [clamped, animated, animValue]);

    const styles = useThemedStyles((t) => {
      const sp1 = t.spacing[1] ?? 4;
      const sp2 = t.spacing[2] ?? 8;
      const sp3 = t.spacing[3] ?? 12;

      return {
        track: {
          width: '100%',
          overflow: 'hidden',
          borderRadius: t.radius.full,
        },
        fill: {
          height: '100%',
          borderRadius: t.radius.full,
        },
        sizeSm: {
          height: sp1, // 4
        },
        sizeMd: {
          height: sp2, // 8
        },
        sizeLg: {
          height: sp3, // 12
        },
        variantPrimary: {
          backgroundColor: t.colors.primary,
        },
        variantSuccess: {
          backgroundColor: t.colors.success,
        },
        variantWarning: {
          backgroundColor: t.colors.warning,
        },
        variantError: {
          backgroundColor: t.colors.error,
        },
        defaultTrack: {
          backgroundColor: t.colors.surfaceVariant,
        },
      };
    });

    const getVariantFillStyle = () => {
      switch (variant) {
        case 'success':
          return styles.variantSuccess;
        case 'warning':
          return styles.variantWarning;
        case 'error':
          return styles.variantError;
        case 'primary':
        default:
          return styles.variantPrimary;
      }
    };

    const getSizeStyle = () => {
      switch (size) {
        case 'sm':
          return styles.sizeSm;
        case 'lg':
          return styles.sizeLg;
        case 'md':
        default:
          return styles.sizeMd;
      }
    };

    const widthInterpolated = animValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(clamped),
          ...accessibilityValue,
        }}
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.track,
          getSizeStyle(),
          styles.defaultTrack,
          trackColor ? { backgroundColor: trackColor } : null,
          style,
        ]}
        {...rest}
      >
        <Animated.View
          style={[
            styles.fill,
            getVariantFillStyle(),
            color ? { backgroundColor: color } : null,
            { width: animated ? widthInterpolated : `${clamped}%` },
          ]}
        />
      </View>
    );
  },
);

AppProgress.displayName = 'AppProgress';
