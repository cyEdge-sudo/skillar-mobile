import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    View,
} from 'react-native';
import { Text } from '../text/text';

export interface TextInputProps extends RNTextInputProps {
    error?: string;
    label?: string;
}

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
    ({ error, label, style, onBlur, onFocus, ...rest }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        const handleFocus: TextInputProps['onFocus'] = (e) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur: TextInputProps['onBlur'] = (e) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        const accessibilityLabel = label
            ? error
                ? `${label}, error: ${error}`
                : label
            : undefined;

        return (
            <View style={styles.container}>
                {label && <Text style={styles.label}>{label}</Text>}
                <RNTextInput
                    ref={ref}
                    style={[
                        styles.input,
                        isFocused && styles.focused,
                        error && styles.error,
                        style,
                    ]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityState={{ disabled: rest.editable === false }}
                    accessibilityLiveRegion="polite"
                    {...rest}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
    container: { marginVertical: 4 },
    label: { fontSize: 14, marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    focused: { borderColor: '#007AFF' },
    error: { borderColor: '#d00' },
    errorText: { color: '#d00', fontSize: 12, marginTop: 4 },
});