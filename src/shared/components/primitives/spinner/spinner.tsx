import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

export type SpinnerProps = ActivityIndicatorProps;

export const Spinner = React.forwardRef<ActivityIndicator, SpinnerProps>((props, ref) => (
    <ActivityIndicator ref={ref} {...props} />
));

Spinner.displayName = 'Spinner';