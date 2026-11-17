import { createContext } from 'react';

import type { DesignSystem } from '../types';

export const ThemeContext = createContext<DesignSystem | null>(null);
