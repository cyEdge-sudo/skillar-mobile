import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/shared/theme';

export interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    progress: number;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    style?: any;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 64,
    strokeWidth = 5,
    progress,
    color,
    backgroundColor,
    children,
    style,
}) => {
    const { colors } = useTheme();
    const strokeColor = color ?? colors.primary;
    const trackColor = backgroundColor ?? colors.border;

    const { radius, strokeDashoffset, strokeDasharray } = useMemo(() => {
        const r = (size - strokeWidth) / 2;
        const circ = 2 * Math.PI * r;
        const clamped = Math.min(1, Math.max(0, progress));
        return {
            radius: r,
            strokeDasharray: circ,
            strokeDashoffset: circ * (1 - clamped),
        };
    }, [size, strokeWidth, progress]);

    return (
        <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            {children}
        </View>
    );
};
