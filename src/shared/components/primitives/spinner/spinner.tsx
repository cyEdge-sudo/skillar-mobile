import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

export type SpinnerProps = ActivityIndicatorProps;

export const Spinner = (props: SpinnerProps) => <ActivityIndicator {...props} />;

Spinner.displayName = 'Spinner';