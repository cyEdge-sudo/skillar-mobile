import React from 'react';
import { View, Text, Image, StyleSheet, ViewProps, ImageProps, TextStyle } from 'react-native';

export interface EmptyStateProps extends ViewProps {
    imageSource?: ImageProps['source'];
    title?: string;
    description?: string;
    titleStyle?: TextStyle;
    descriptionStyle?: TextStyle;
}

export const EmptyState = React.forwardRef<View, EmptyStateProps>(
    ({ imageSource, title, description, titleStyle, descriptionStyle, style, ...rest }, ref) => (
        <View ref={ref} style={[styles.container, style]} {...rest}>
            {imageSource && <Image source={imageSource} style={styles.image} />}
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}
        </View>
    )
);

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', padding: 24 },
    image: { width: 80, height: 80, marginBottom: 16 },
    title: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center' },
    description: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});