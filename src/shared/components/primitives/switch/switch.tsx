import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';

export type SwitchProps = RNSwitchProps;

export const Switch = (props: SwitchProps) => <RNSwitch {...props} />;

Switch.displayName = 'Switch';