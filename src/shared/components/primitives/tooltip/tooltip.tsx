import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ViewProps, TextStyle } from 'react-native';

export interface TooltipProps extends ViewProps {
    content: string | React.ReactNode;
    contentStyle?: TextStyle;
    children: React.ReactNode;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
}

export const Tooltip = React.forwardRef<View, TooltipProps>(
    ({ content, contentStyle, children, visible: controlledVisible, onVisibleChange, style, ...rest }, ref) => {
        const [internalVisible, setInternalVisible] = useState(false);
        const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;

        const setVisible = (v: boolean) => {
            if (controlledVisible === undefined) setInternalVisible(v);
            onVisibleChange?.(v);
        };

        const toggle = () => setVisible(!isVisible);

        return (
            <View ref={ref} style={style} {...rest}>
                <Pressable onPress={toggle}>{children}</Pressable>
                {isVisible && (
                    <Modal transparent animationType="fade">
                        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                            <View style={styles.tooltipContainer}>
                                <View style={styles.tooltip}>
                                    {typeof content === 'string' ? (
                                        <Text style={[styles.content, contentStyle]}>{content}</Text>
                                    ) : (
                                        content
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }
);

Tooltip.displayName = 'Tooltip';

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
    tooltipContainer: { padding: 16, maxWidth: '80%' },
    tooltip: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 8,
    },
    content: { color: '#fff', fontSize: 14, textAlign: 'center' },
});