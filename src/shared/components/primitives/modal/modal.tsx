import React from 'react';
import { Modal as RNModal, ModalProps as RNModalProps } from 'react-native';

export type ModalProps = RNModalProps;

export const Modal = React.forwardRef<RNModal, ModalProps>((props, ref) => (
    <RNModal ref={ref} transparent animationType="fade" {...props} />
));

Modal.displayName = 'Modal';