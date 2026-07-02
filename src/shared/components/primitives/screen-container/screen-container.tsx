import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeArea, SafeAreaProps } from '../safe-area/safe-area';

export type ScreenContainerProps = SafeAreaProps;

export const ScreenContainer = React.forwardRef<
    React.ComponentRef<typeof SafeAreaView>,
    ScreenContainerProps
>(({ style, ...rest }, ref) => {
    return (
        <SafeArea ref={ref} style={[styles.screen, { backgroundColor: '#fff' }, style]} {...rest} />
    );
});

ScreenContainer.displayName = 'ScreenContainer';

const styles = StyleSheet.create({
    screen: { flex: 1 },
});