import React from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export type SafeAreaProps = SafeAreaViewProps;

export const SafeArea = React.forwardRef<
    React.ComponentRef<typeof SafeAreaView>,
    SafeAreaProps
>((props, ref) => <SafeAreaView ref={ref} {...props} />);

SafeArea.displayName = 'SafeArea';