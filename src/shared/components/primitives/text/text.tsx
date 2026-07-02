import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
    variant?: 'body' | 'heading' | 'caption';
    color?: 'default' | 'muted' | 'error';
}

export const Text = React.forwardRef<RNText, TextProps>(
    ({ variant = 'body', color = 'default', style, ...rest }, ref) => {
        const colorMap: Record<string, string> = {
            default: '#000',
            muted: '#666',
            error: '#d00',
        };

        return (
            <RNText
                ref={ref}
                style={[styles.base, styles[variant], { color: colorMap[color] }, style]}
                accessibilityRole="text"
                {...rest}
            />
        );
    }
);

const styles = StyleSheet.create({
    base: { fontFamily: 'System' }, // fallback – themed layer will override
    body: { fontSize: 16, lineHeight: 24 },
    heading: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    caption: { fontSize: 12, lineHeight: 16 },
});