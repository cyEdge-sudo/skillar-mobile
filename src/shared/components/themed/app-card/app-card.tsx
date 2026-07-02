import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/shared/theme';

export interface AppCardProps extends ViewProps {
    variant?: 'default' | 'outlined' | 'flat';
    padding?: 'none' | 'small' | 'medium' | 'large';
}

export const AppCard = React.forwardRef<View, AppCardProps>(
    ({ variant = 'default', padding = 'medium', style, children, ...rest }, ref) => {
        const { colors, radius, spacing, elevation } = useTheme();

        const getPadding = () => {
            switch (padding) {
                case 'none':
                    return spacing[0];
                case 'small':
                    return spacing[8];
                case 'medium':
                    return spacing[16];
                case 'large':
                    return spacing[24];
                default:
                    return spacing[16];
            }
        };

        const cardStyle = [
            {
                backgroundColor: colors.surface,
                borderRadius: radius[8],
                padding: getPadding(),
            },
            variant === 'default' && elevation.small,
            variant === 'outlined' && {
                borderWidth: 1,
                borderColor: colors.border,
            },
            variant === 'flat' && {
                backgroundColor: colors.surfaceVariant,
            },
            style,
        ];

        return (
            <View ref={ref} style={cardStyle} {...rest}>
                {children}
            </View>
        );
    }
);

AppCard.displayName = 'AppCard';
