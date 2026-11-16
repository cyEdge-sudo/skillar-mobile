import React from 'react';
import { Modal as RNModal, ModalProps as RNModalProps, type ModalInstance } from 'react-native';

export type ModalProps = RNModalProps;

export const Modal = React.forwardRef<ModalInstance, ModalProps>((props, ref) => (
    <RNModal ref={ref} transparent animationType="fade" {...props} />
));

Modal.displayName = 'Modal';