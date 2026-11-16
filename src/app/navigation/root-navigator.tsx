import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../core/auth/auth-context";
import { AppButton } from "../../shared/components";
import { colors, spacing } from "../../shared/theme/tokens";
import { AuthStack } from "./auth-stack";
import { MainTabs } from "./main-tabs";

function SessionRestoreScreen() {
  const { error, retrySessionRestore } = useAuth();

  return (
    <View style={styles.loadingContainer}>
      {error ? (
        <>
          <Text style={styles.title}>Unable to connect</Text>
          <Text style={styles.message}>
            Your saved session could not be checked. Check your connection and try again.
          </Text>
          <AppButton title="Retry" onPress={() => void retrySessionRestore()} />
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Loading Skillar…</Text>
        </>
      )}
    </View>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  return (
    <NavigationContainer>
      {status === "restoring" || status === "error" ? (
        <SessionRestoreScreen />
      ) : status === "authenticated" ? (
        <MainTabs />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
