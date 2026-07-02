import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, TextStyle, ViewStyle, View } from 'react-native';

export interface ChipProps extends Omit<PressableProps, 'children'> {
    label: string;
    labelStyle?: TextStyle;
    style?: ViewStyle;
    selected?: boolean;
    color?: string;
}

export const Chip = React.forwardRef<View, ChipProps>(
    ({ label, labelStyle, style, selected, disabled, color = '#007AFF', ...rest }, ref) => {
        return (
            <Pressable
                ref={ref}
                style={({ pressed }) => [
                    styles.chip,
                    { borderColor: '#ccc' },
                    style,
                    selected && { borderColor: color, backgroundColor: color },
                    disabled && styles.disabled,
                    pressed && !disabled && styles.pressed,
                ]}
                disabled={disabled}
                accessibilityRole="button"
                {...rest}
            >
                <Text style={[styles.label, { color: '#333' }, labelStyle, selected && { color: '#fff' }]}>{label}</Text>
            </Pressable>
        );
    }
);

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    label: { fontSize: 14 },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.7 },
});