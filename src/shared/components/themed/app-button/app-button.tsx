import React from 'react';
import { useTheme } from '@/shared/theme';
import { Button, ButtonProps } from '../../primitives/button';
import { AppText } from '../app-text/app-text';

export interface AppButtonProps extends ButtonProps {}

export const AppButton = React.forwardRef<React.ComponentRef<typeof Button>, AppButtonProps>(
    ({ variant = 'solid', children, style, ...rest }, ref) => {
        const { colors, radius } = useTheme();

        const getButtonStyle = () => {
            switch (variant) {
                case 'solid':
                    return {
                        backgroundColor: colors.primary,
                        borderRadius: radius[8],
                    };
                case 'outline':
                    return {
                        backgroundColor: colors.transparent,
                        borderWidth: 1,
                        borderColor: colors.primary,
                        borderRadius: radius[8],
                    };
                case 'ghost':
                    return {
                        backgroundColor: colors.transparent,
                    };
                default:
                    return {};
            }
        };

        const getTextColor = () => {
            if (variant === 'solid') return colors.white;
            return colors.primary;
        };

        const renderedChildren = typeof children === 'string' ? (
            <AppText style={{ color: getTextColor(), fontWeight: '600' }}>
                {children}
            </AppText>
        ) : (
            children
        );

        return (
            <Button
                ref={ref}
                variant={variant}
                style={[getButtonStyle(), style]}
                {...rest}
            >
                {renderedChildren}
            </Button>
        );
    }
);

AppButton.displayName = 'AppButton';
