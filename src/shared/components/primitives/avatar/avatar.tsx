import React from 'react';
import { View, Image, Text, StyleSheet, ViewProps, ImageProps, TextStyle } from 'react-native';

export interface AvatarProps extends ViewProps {
    source?: ImageProps['source'];
    size?: number;
    initials?: string;
    initialsStyle?: TextStyle;
}

export const Avatar = React.forwardRef<View, AvatarProps>(
    ({ source, size = 48, initials, initialsStyle, style, ...rest }, ref) => {
        const containerStyle = [styles.container, { width: size, height: size, borderRadius: size / 2 }, style];

        if (source) {
            return (
                <View ref={ref} style={containerStyle} {...rest}>
                    <Image source={source} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
                </View>
            );
        }

        return (
            <View ref={ref} style={[containerStyle, styles.initialsContainer]} {...rest}>
                <Text style={[styles.initials, { fontSize: size * 0.4 }, initialsStyle]}>{initials}</Text>
            </View>
        );
    }
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
    container: { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    image: { resizeMode: 'cover' },
    initialsContainer: { backgroundColor: '#e0e0e0' },
    initials: { color: '#333', fontWeight: '600' },
});