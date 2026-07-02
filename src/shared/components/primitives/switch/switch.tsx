import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';

export type SwitchProps = RNSwitchProps;

export const Switch = React.forwardRef<RNSwitch, SwitchProps>((props, ref) => (
    <RNSwitch ref={ref} {...props} />
));

Switch.displayName = 'Switch';