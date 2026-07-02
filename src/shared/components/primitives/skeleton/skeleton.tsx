import React from 'react';
import { View, StyleSheet, ViewProps, DimensionValue } from 'react-native';

export interface SkeletonProps extends ViewProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
}

export const Skeleton = React.forwardRef<View, SkeletonProps>(
    ({ width = '100%', height = 24, borderRadius = 4, style, ...rest }, ref) => (
        <View
            ref={ref}
            style={[styles.skeleton, { width, height, borderRadius }, style]}
            {...rest}
        />
    )
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
    skeleton: { backgroundColor: '#e0e0e0' },
});