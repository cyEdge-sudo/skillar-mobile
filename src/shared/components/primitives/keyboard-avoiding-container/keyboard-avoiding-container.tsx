import React from 'react';
import { KeyboardAvoidingView, Platform, KeyboardAvoidingViewProps } from 'react-native';

export type KeyboardAvoidingContainerProps = KeyboardAvoidingViewProps;

export const KeyboardAvoidingContainer = React.forwardRef<KeyboardAvoidingView, KeyboardAvoidingContainerProps>(
    ({ behavior = Platform.OS === 'ios' ? 'padding' : 'height', ...props }, ref) => (
        <KeyboardAvoidingView ref={ref} behavior={behavior} {...props} />
    )
);

KeyboardAvoidingContainer.displayName = 'KeyboardAvoidingContainer';