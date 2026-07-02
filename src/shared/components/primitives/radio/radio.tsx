import React from 'react';
import { Pressable, View, StyleSheet, PressableProps, ViewStyle } from 'react-native';

export interface RadioProps extends Omit<PressableProps, 'children'> {
    selected: boolean;
    onSelect?: (selected: boolean) => void;
    style?: ViewStyle;
}

export const Radio = React.forwardRef<View, RadioProps>(
    ({ selected, onSelect, style, disabled, ...rest }, ref) => {
        const handlePress = () => {
            if (!disabled && onSelect) {
                onSelect(!selected);
            }
        };

        return (
            <Pressable
                ref={ref}
                style={({ pressed }) => [
                    styles.outer,
                    style,
                    selected && styles.selectedOuter,
                    disabled && styles.disabled,
                    pressed && !disabled && styles.pressed,
                ]}
                onPress={handlePress}
                disabled={disabled}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                {...rest}
            >
                {selected && <View style={styles.inner} />}
            </Pressable>
        );
    }
);

Radio.displayName = 'Radio';

const styles = StyleSheet.create({
    outer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    selectedOuter: { borderColor: '#007aff' },
    inner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007aff',
    },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.7 },
});