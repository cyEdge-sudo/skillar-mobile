import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Chip, ChipProps } from '../../primitives/chip';

export interface AppChipProps extends Omit<ChipProps, 'label'> {
    label?: string;
    children?: string;
    size?: 'small' | 'medium';
}

export const AppChip = React.forwardRef<React.ComponentRef<typeof Chip>, AppChipProps>(
    ({ selected = false, size = 'medium', label, children, style, labelStyle, ...rest }, ref) => {
        const { colors, radius, spacing, typography } = useTheme();

        const resolvedLabel = label || children || '';

        const getPadding = () => {
            if (size === 'small') {
                return {
                    paddingHorizontal: spacing[8],
                    paddingVertical: spacing[2],
                };
            }
            return {
                paddingHorizontal: spacing[12],
                paddingVertical: spacing[4],
            };
        };

        const getLabelStyle = (): TextStyle => {
            if (size === 'small') {
                return {
                    fontSize: typography.labelSmall.fontSize,
                    lineHeight: typography.labelSmall.lineHeight,
                };
            }
            return {
                fontSize: typography.labelMedium.fontSize,
                lineHeight: typography.labelMedium.lineHeight,
            };
        };

        const chipStyle = StyleSheet.flatten([
            {
                borderRadius: radius[999],
                backgroundColor: colors.transparent,
                borderWidth: 1,
                borderColor: colors.border,
            },
            getPadding(),
            selected && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
            },
            style,
        ]);

        const resolvedLabelStyle = StyleSheet.flatten([
            {
                color: colors.textSecondary,
            },
            getLabelStyle(),
            selected && {
                color: colors.white,
            },
            labelStyle,
        ]);

        return (
            <Chip
                ref={ref}
                selected={selected}
                label={resolvedLabel}
                style={chipStyle}
                labelStyle={resolvedLabelStyle}
                {...rest}
            />
        );
    }
);

AppChip.displayName = 'AppChip';
