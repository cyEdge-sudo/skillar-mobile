import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextStyle } from 'react-native';

export interface ListItemProps extends ViewProps {
    title: string;
    subtitle?: string;
    titleStyle?: TextStyle;
    subtitleStyle?: TextStyle;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const ListItem = React.forwardRef<View, ListItemProps>(
    ({ title, subtitle, titleStyle, subtitleStyle, leftElement, rightElement, style, ...rest }, ref) => (
        <View ref={ref} style={[styles.container, style]} {...rest}>
            {leftElement && <View style={styles.left}>{leftElement}</View>}
            <View style={styles.middle}>
                <Text style={[styles.title, titleStyle]} numberOfLines={1}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>{subtitle}</Text>}
            </View>
            {rightElement && <View style={styles.right}>{rightElement}</View>}
        </View>
    )
);

ListItem.displayName = 'ListItem';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    left: { marginRight: 12 },
    middle: { flex: 1 },
    right: { marginLeft: 12 },
    title: { fontSize: 16, color: '#333' },
    subtitle: { fontSize: 14, color: '#666' },
});