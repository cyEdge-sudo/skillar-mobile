import { elevation } from '../tokens/elevation';
import { motion } from '../tokens/motion';
import { opacity } from '../tokens/opacity';
import { palette } from '../tokens/palette';
import { radius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { zIndex } from '../tokens/z-index';
import type { DesignSystem } from '../types';
import { typography } from './typography';

export const lightTheme: DesignSystem = {
    colors: {
        primary: palette.blue[600],
        secondary: palette.indigo[500],
        background: palette.white,
        surface: palette.slate[50],
        surfaceVariant: palette.slate[100],
        text: palette.slate[900],
        textSecondary: palette.slate[500],
        textDisabled: palette.slate[300],
        border: palette.slate[200],
        divider: palette.slate[200],
        success: palette.green[500],
        warning: palette.amber[500],
        error: palette.red[500],
        info: palette.blue[500],
        overlay: 'rgba(0, 0, 0, 0.5)',
        white: palette.white,
        black: palette.black,
        transparent: palette.transparent,
    },

    typography,
    spacing,
    radius,
    elevation,
    opacity,
    motion,
    zIndex,
};
