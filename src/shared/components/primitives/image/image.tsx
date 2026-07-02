import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

export type ImageProps = RNImageProps;

export const Image = React.forwardRef<RNImage, ImageProps>((props, ref) => (
    <RNImage ref={ref} {...props} />
));

Image.displayName = 'Image';