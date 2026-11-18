import React from 'react';
import { useTheme } from '@/shared/theme';
import { Text, TextProps } from '../../primitives/text';

export interface AppTextProps extends Omit<TextProps, 'variant' | 'color'> {
  variant?:
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'bodyLg'
    | 'body'
    | 'sm'
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall'
    | 'caption'
    | 'overline';
  color?:
    | 'primary'
    | 'secondary'
    | 'text'
    | 'textSecondary'
    | 'textDisabled'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'white'
    | 'black';
}

export const AppText = React.forwardRef<any, AppTextProps>(
  ({ variant = 'bodyMedium', color = 'text', style, ...rest }, ref) => {
    const { typography, colors } = useTheme();
    const typoStyle = typography[variant as keyof typeof typography] ?? typography.body;
    const rawColor = colors[color as keyof typeof colors];
    const textColor = typeof rawColor === 'string' ? rawColor : colors.text;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily: typoStyle.fontFamily,
            fontSize: typoStyle.fontSize,
            fontWeight: typoStyle.fontWeight,
            lineHeight: typoStyle.lineHeight,
            letterSpacing: typoStyle.letterSpacing,
            color: textColor,
          },
          style,
        ]}
        {...rest}
      />
    );
  },
);

AppText.displayName = 'AppText';
