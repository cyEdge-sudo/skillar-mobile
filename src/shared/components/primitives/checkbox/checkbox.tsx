import React from 'react';
import { Pressable, View, StyleSheet, PressableProps, ViewStyle } from 'react-native';

export interface CheckboxProps extends Omit<PressableProps, 'children'> {
    checked: boolean;
    onCheckedChange?: (checked: boolean) => void;
    style?: ViewStyle;
}

export const Checkbox = React.forwardRef<View, CheckboxProps>(
    ({ checked, onCheckedChange, style, disabled, ...rest }, ref) => {
        const handlePress = () => {
            if (!disabled && onCheckedChange) {
                onCheckedChange(!checked);
            }
        };

        return (
            <Pressable
                ref={ref}
                style={({ pressed }) => [
                    styles.container,
                    style,
                    checked && styles.checked,
                    disabled && styles.disabled,
                    pressed && !disabled && styles.pressed,
                ]}
                onPress={handlePress}
                disabled={disabled}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                {...rest}
            >
                {checked && <View style={styles.checkmark} />}
            </Pressable>
        );
    }
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checked: { borderColor: '#007aff', backgroundColor: '#007aff' },
    checkmark: {
        width: 12,
        height: 12,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.7 },
});