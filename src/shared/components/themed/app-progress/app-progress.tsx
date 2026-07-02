import React from 'react';
import { useTheme } from '@/shared/theme';
import { Progress, ProgressProps } from '../../primitives/progress';

export interface AppProgressProps extends ProgressProps {}

export const AppProgress = React.forwardRef<React.ComponentRef<typeof Progress>, AppProgressProps>(
    ({ color, trackColor, ...rest }, ref) => {
        const { colors } = useTheme();

        return (
            <Progress
                ref={ref}
                color={color || colors.primary}
                trackColor={trackColor || colors.surfaceVariant}
                {...rest}
            />
        );
    }
);

AppProgress.displayName = 'AppProgress';
