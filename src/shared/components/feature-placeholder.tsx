import { StyleSheet, View } from "react-native";

import { useTheme } from "../theme";
import { AppText } from "./themed/app-text";

interface FeaturePlaceholderProps {
  title: string;
  description: string;
}

export function FeaturePlaceholder({
  title,
  description,
}: FeaturePlaceholderProps) {
  const { colors, radius, spacing } = useTheme();

  const styles = StyleSheet.create({
    card: {
      borderRadius: radius[16],
      padding: spacing[20],
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing[8],
    },
    description: {
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.card}>
      <AppText variant="titleMedium">{title}</AppText>
      <AppText color="textSecondary" style={styles.description}>
        {description}
      </AppText>
    </View>
  );
}
