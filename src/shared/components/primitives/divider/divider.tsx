import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export interface DividerProps extends ViewProps {
    orientation?: 'horizontal' | 'vertical';
    thickness?: number;
}

export const Divider = React.forwardRef<View, DividerProps>(
    ({ orientation = 'horizontal', thickness = 1, style, ...rest }, ref) => (
        <View
            ref={ref}
            style={[
                styles.divider,
                orientation === 'horizontal' ? { height: thickness, width: '100%' } : { width: thickness, height: '100%' },
                style,
            ]}
            {...rest}
        />
    )
);

Divider.displayName = 'Divider';

const styles = StyleSheet.create({
    divider: { backgroundColor: '#ccc' },
});