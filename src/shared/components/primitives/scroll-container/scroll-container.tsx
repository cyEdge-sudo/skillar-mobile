import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';

export type ScrollContainerProps = ScrollViewProps;

export const ScrollContainer = React.forwardRef<
    View,
    ScrollContainerProps
>(({ style, contentContainerStyle, ...rest }, ref) => (
    <View ref={ref} style={styles.container}>
        <ScrollView
            contentContainerStyle={[styles.content, contentContainerStyle]}
            style={style}
            {...rest}
        />
    </View>
));

ScrollContainer.displayName = 'ScrollContainer';

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
});