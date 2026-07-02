import React from 'react';
import { Modal, View, StyleSheet, ModalProps, ViewStyle } from 'react-native';

export interface PortalProps extends ModalProps {
    visible: boolean;
    containerStyle?: ViewStyle;
    children: React.ReactNode;
}

export const Portal = React.forwardRef<View, PortalProps>(
    ({ visible, containerStyle, children, ...modalProps }, ref) => (
        <Modal visible={visible} transparent animationType="fade" {...modalProps}>
            <View ref={ref} style={[styles.overlay, containerStyle]}>
                {children}
            </View>
        </Modal>
    )
);

Portal.displayName = 'Portal';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});