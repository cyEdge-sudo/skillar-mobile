import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import { Text } from '../text/text';

export interface ButtonProps extends TouchableOpacityProps {
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    color?: string;
}

export const Button = React.forwardRef<View, ButtonProps>(
    (
        {
            variant = 'solid',
            size = 'medium',
            loading = false,
            disabled = false,
            children,
            style,
            color = '#007AFF',
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.7}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDisabled }}
                style={[
                    styles.base,
                    variant === 'solid' && { backgroundColor: color },
                    variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: color },
                    variant === 'ghost' && { backgroundColor: 'transparent' },
                    styles[size],
                    isDisabled && styles.disabled,
                    style,
                ]}
                {...rest}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    typeof children === 'string' ? (
                        <Text style={[styles.text, variant === 'solid' && { color: '#fff' }, (variant === 'outline' || variant === 'ghost') && { color }]}>
                            {children}
                        </Text>
                    ) : (
                        children
                    )
                )}
            </TouchableOpacity>
        );
    }
);

const styles = StyleSheet.create({
    base: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    small: { paddingVertical: 6, paddingHorizontal: 12, minHeight: 32 },
    medium: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 44 },
    large: { paddingVertical: 14, paddingHorizontal: 24, minHeight: 52 },
    disabled: { opacity: 0.5 },
    text: { fontSize: 16, fontWeight: '600' },
});