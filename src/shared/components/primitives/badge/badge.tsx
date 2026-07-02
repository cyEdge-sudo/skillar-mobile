import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Text } from '../text/text';

export interface BadgeProps extends ViewProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'small' | 'medium';
    label?: string;
}

export const Badge = React.forwardRef<View, BadgeProps>(
    ({
        variant = 'default',
        size = 'medium',
        label,
        style,
        children,
        ...rest
    }, ref) => {
        const content = label || children;
        return (
            <View
                ref={ref}
                style={[styles.base, styles[variant], styles[size], style]}
                accessibilityRole="text"
                {...rest}
            >
                {typeof content === 'string' ? (
                    <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
                        {content}
                    </Text>
                ) : (
                    content
                )}
            </View>
        );
    }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
    base: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
    },
    default: { backgroundColor: '#e0e0e0' },
    success: { backgroundColor: '#d4edda' },
    warning: { backgroundColor: '#fff3cd' },
    error: { backgroundColor: '#f8d7da' },
    info: { backgroundColor: '#d1ecf1' },
    small: { paddingHorizontal: 6, paddingVertical: 1 },
    medium: { paddingHorizontal: 8, paddingVertical: 2 },
    text: { fontSize: 12, fontWeight: '600' },
    defaultText: { color: '#333' },
    successText: { color: '#155724' },
    warningText: { color: '#856404' },
    errorText: { color: '#721c24' },
    infoText: { color: '#0c5460' },
    smallText: { fontSize: 10 },
    mediumText: { fontSize: 12 },
});