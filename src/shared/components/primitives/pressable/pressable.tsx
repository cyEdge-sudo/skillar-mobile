import React from 'react';
import { Pressable as RNPressable, PressableProps as RNPressableProps } from 'react-native';

export type PressableProps = RNPressableProps;

export const Pressable = React.forwardRef<
    React.ComponentRef<typeof RNPressable>,
    PressableProps
>((props, ref) => (
    <RNPressable ref={ref} {...props} />
));

Pressable.displayName = 'Pressable';