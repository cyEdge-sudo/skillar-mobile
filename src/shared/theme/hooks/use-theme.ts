import { useContext } from 'react';

import type { DesignSystem } from '../types';
import { ThemeContext } from '../context';
import { lightTheme } from '../themes';

export const useTheme = (): DesignSystem => {
    const theme = useContext(ThemeContext);

    // ponytail: fallback to lightTheme if context missing (e.g. during module init)
    return theme ?? lightTheme;
};
