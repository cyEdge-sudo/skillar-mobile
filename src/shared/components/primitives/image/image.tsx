import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, type ImageInstance } from 'react-native';

export type ImageProps = RNImageProps;

export const Image = React.forwardRef<ImageInstance, ImageProps>((props, ref) => (
  <RNImage ref={ref} {...props} />
));

Image.displayName = 'Image';
