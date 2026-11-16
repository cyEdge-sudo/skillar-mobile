import React from 'react';
import { Image, StyleSheet, ImageProps, type ImageInstance } from 'react-native';

export interface IconProps extends Omit<ImageProps, 'source'> {
    source: ImageProps['source'];
    size?: number;
}

export const Icon = React.forwardRef<ImageInstance, IconProps>(
    ({ source, size = 24, style, ...rest }, ref) => (
        <Image
            ref={ref}
            source={source}
            style={[styles.icon, { width: size, height: size }, style]}
            {...rest}
        />
    )
);

Icon.displayName = 'Icon';

const styles = StyleSheet.create({
    icon: { resizeMode: 'contain' },
});