import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

export interface ProgressProps extends ViewProps {
    progress: number; // 0–1
    height?: number;
    color?: string;
    trackColor?: string;
}

export const Progress = React.forwardRef<View, ProgressProps>(
    ({
        progress,
        height = 8,
        color = '#007AFF',
        trackColor = '#e0e0e0',
        style,
        ...rest
    }, ref) => {
        const clamped = Math.min(1, Math.max(0, progress));
        return (
            <View
                ref={ref}
                style={[styles.track, { height, backgroundColor: trackColor }, style]}
                {...rest}
            >
                <View
                    style={[
                        styles.fill,
                        { width: `${clamped * 100}%`, height, backgroundColor: color },
                    ]}
                />
            </View>
        );
    }
);

Progress.displayName = 'Progress';

const styles = StyleSheet.create({
    track: { borderRadius: 4, overflow: 'hidden', width: '100%' },
    fill: { borderRadius: 4 },
});