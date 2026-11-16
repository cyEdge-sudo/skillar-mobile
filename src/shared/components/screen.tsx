import type { PropsWithChildren } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme";

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = false,
  contentContainerStyle,
  style,
}: ScreenProps) {
  const { colors, spacing } = useTheme();

  const containerStyle = [
    styles.content,
    { padding: spacing[24] },
    style,
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { padding: spacing[24] },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
