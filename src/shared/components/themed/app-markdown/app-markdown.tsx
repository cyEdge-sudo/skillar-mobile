import Markdown, { type MarkdownProps } from 'react-native-markdown-display';

import { useTheme } from '@/shared/theme';

export interface AppMarkdownProps {
  children: string;
}

/**
 * Renders Markdown with the shared semantic colors and typography.
 * Feature screens should not define their own Markdown theme.
 */
export function AppMarkdown({ children }: AppMarkdownProps) {
  const { colors, spacing, typography } = useTheme();

  const markdownStyles: NonNullable<MarkdownProps['style']> = {
    body: {
      color: colors.text,
      fontSize: typography.bodyMedium.fontSize,
      lineHeight: typography.bodyMedium.lineHeight,
    },
    heading1: {
      color: colors.text,
      fontSize: typography.headlineSmall.fontSize,
    },
    heading2: {
      color: colors.text,
      fontSize: typography.titleLarge.fontSize,
    },
    heading3: {
      color: colors.text,
      fontSize: typography.titleMedium.fontSize,
    },
    paragraph: { marginTop: 0, marginBottom: spacing[12] },
    code_inline: {
      backgroundColor: colors.surfaceVariant,
      color: colors.text,
    },
    code_block: {
      backgroundColor: colors.surfaceVariant,
      color: colors.text,
      padding: spacing[12],
    },
    blockquote: {
      backgroundColor: colors.surfaceVariant,
      borderLeftColor: colors.primary,
    },
    link: { color: colors.primary },
  };

  return <Markdown style={markdownStyles}>{children}</Markdown>;
}
