import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useThemedStyles } from '@/shared/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded';

export interface AppAvatarProps extends Omit<ViewProps, 'style'> {
  /**
   * Remote image URI or local asset source.
   */
  source?: ImageSourcePropType;

  /**
   * User or entity name, used for rendering initials fallback and accessibility label.
   */
  name?: string;

  /**
   * Explicit initials override (takes precedence over name derivation).
   */
  initials?: string;

  /**
   * Avatar dimension size token:
   * - `sm`: 32x32
   * - `md`: 40x40
   * - `lg`: 48x48
   * - `xl`: 64x64
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Shape variant:
   * - `circle`: Circular border radius
   * - `rounded`: Squircle/rounded rectangle using theme radius tokens
   * @default 'circle'
   */
  variant?: AvatarVariant;

  /**
   * Container style overrides.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Extracts up to 2 uppercase initials from a person or entity name.
 * e.g., "John Doe" -> "JD", "Ashok" -> "A", "Jane Mary Watson" -> "JW"
 */
export function getInitials(name?: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0];
  if (!first) return '';
  if (parts.length === 1) {
    return first.charAt(0).toUpperCase();
  }
  const last = parts[parts.length - 1];
  if (last) {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }
  return first.charAt(0).toUpperCase();
}

export const AppAvatar = React.forwardRef<React.ComponentRef<typeof View>, AppAvatarProps>(
  (
    {
      source,
      name,
      initials,
      size = 'md',
      variant = 'circle',
      accessibilityLabel,
      style,
      ...rest
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setHasError(false);
    }, [source]);

    const styles = useThemedStyles((theme) => {
      const surfaceBg = theme.colors.surfaceMuted ?? theme.colors.surfaceVariant;
      return {
        containerBase: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: surfaceBg,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        image: {
          width: '100%',
          height: '100%',
        },
        textBase: {
          fontFamily: theme.typography.h4.fontFamily,
          fontWeight: '600',
          color: theme.colors.text,
          textAlign: 'center',
          includeFontPadding: false,
        },
        // Dimension sizes
        sizeSm: {
          width: theme.spacing[32],
          height: theme.spacing[32],
        },
        sizeMd: {
          width: theme.spacing[40],
          height: theme.spacing[40],
        },
        sizeLg: {
          width: theme.spacing[48],
          height: theme.spacing[48],
        },
        sizeXl: {
          width: theme.spacing[64],
          height: theme.spacing[64],
        },
        // Typography per size
        textSm: {
          fontSize: theme.typography.sm.fontSize,
          lineHeight: theme.typography.sm.lineHeight,
        },
        textMd: {
          fontSize: theme.typography.bodyLg.fontSize,
          lineHeight: theme.typography.bodyLg.lineHeight,
        },
        textLg: {
          fontSize: theme.typography.h3.fontSize,
          lineHeight: theme.typography.h3.lineHeight,
        },
        textXl: {
          fontSize: theme.typography.h2.fontSize,
          lineHeight: theme.typography.h2.lineHeight,
        },
        // Variant radii
        circle: {
          borderRadius: theme.radius[999],
        },
        roundedSm: {
          borderRadius: theme.radius[4],
        },
        roundedMd: {
          borderRadius: theme.radius[8],
        },
        roundedLg: {
          borderRadius: theme.radius[12],
        },
        roundedXl: {
          borderRadius: theme.radius[16],
        },
      };
    });

    const sizeStyle =
      size === 'sm'
        ? styles.sizeSm
        : size === 'lg'
          ? styles.sizeLg
          : size === 'xl'
            ? styles.sizeXl
            : styles.sizeMd;

    const textStyle =
      size === 'sm'
        ? styles.textSm
        : size === 'lg'
          ? styles.textLg
          : size === 'xl'
            ? styles.textXl
            : styles.textMd;

    const radiusStyle =
      variant === 'circle'
        ? styles.circle
        : size === 'sm'
          ? styles.roundedSm
          : size === 'lg'
            ? styles.roundedLg
            : size === 'xl'
              ? styles.roundedXl
              : styles.roundedMd;

    const hasImage = Boolean(source) && !hasError;
    const computedInitials = initials ?? getInitials(name);
    const label = accessibilityLabel || name || 'User avatar';

    return (
      <View
        ref={ref}
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        style={[styles.containerBase, sizeStyle, radiusStyle, style]}
        {...rest}
      >
        {hasImage ? (
          <Image
            source={source!}
            style={styles.image}
            resizeMode="cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <Text style={[styles.textBase, textStyle]}>{computedInitials}</Text>
        )}
      </View>
    );
  },
);

AppAvatar.displayName = 'AppAvatar';
