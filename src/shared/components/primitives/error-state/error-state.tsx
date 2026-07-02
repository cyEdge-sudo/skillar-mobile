import React from 'react';
import { View, Text, Image, StyleSheet, ViewProps, ImageProps, TextStyle } from 'react-native';

export interface ErrorStateProps extends ViewProps {
    imageSource?: ImageProps['source'];
    title?: string;
    description?: string;
    titleStyle?: TextStyle;
    descriptionStyle?: TextStyle;
}

export const ErrorState = React.forwardRef<View, ErrorStateProps>(
    ({ imageSource, title, description, titleStyle, descriptionStyle, style, ...rest }, ref) => (
        <View ref={ref} style={[styles.container, style]} {...rest}>
            {imageSource && <Image source={imageSource} style={styles.image} />}
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}
        </View>
    )
);

ErrorState.displayName = 'ErrorState';

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', padding: 24 },
    image: { width: 80, height: 80, marginBottom: 16 },
    title: { fontSize: 18, fontWeight: '600', color: '#d32f2f', textAlign: 'center' },
    description: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});