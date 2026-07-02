import React from 'react';
import { useTheme } from '@/shared/theme';
import { ScreenContainer, ScreenContainerProps } from '../../primitives/screen-container';

export interface AppScreenProps extends ScreenContainerProps {}

export const AppScreen = React.forwardRef<
    React.ComponentRef<typeof ScreenContainer>,
    AppScreenProps
>(({ style, ...rest }, ref) => {
    const { colors } = useTheme();

    return (
        <ScreenContainer
            ref={ref}
            style={[{ backgroundColor: colors.background }, style]}
            {...rest}
        />
    );
});

AppScreen.displayName = 'AppScreen';
