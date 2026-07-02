import { elevation } from '../tokens/elevation';
import { motion } from '../tokens/motion';
import { opacity } from '../tokens/opacity';
import { palette } from '../tokens/palette';
import { radius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { zIndex } from '../tokens/z-index';
import type { DesignSystem } from '../types';
import { typography } from './typography';

export const darkTheme: DesignSystem = {
    colors: {
        primary: palette.blue[400],
        secondary: palette.indigo[400],
        background: palette.slate[950],
        surface: palette.slate[900],
        surfaceVariant: palette.slate[800],
        text: palette.slate[50],
        textSecondary: palette.slate[400],
        textDisabled: palette.slate[600],
        border: palette.slate[700],
        divider: palette.slate[700],
        success: palette.green[400],
        warning: palette.amber[400],
        error: palette.red[400],
        info: palette.blue[400],
        overlay: 'rgba(0, 0, 0, 0.7)',
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
