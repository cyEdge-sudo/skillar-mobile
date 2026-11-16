import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";

import { NAVIGATION_ROUTES, UI_COPY } from "../../../core/constants/app.constants";
import { useAuth } from "../../../core/auth/auth-context";
import type { MainTabParamList } from "../../../app/navigation/navigation-types";
import { AppButton, AppText, FeaturePlaceholder, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";

export function DashboardScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user } = useAuth();
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    content: {
      gap: spacing[20],
    },
    heading: {
      gap: spacing[8],
    },
    actions: {
      gap: spacing[12],
    },
  });

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <AppText variant="displaySmall">{UI_COPY.dashboard.greeting}</AppText>
        <AppText color="textSecondary">
          {user?.name ? user.name : UI_COPY.dashboard.description}
        </AppText>
      </View>

      <FeaturePlaceholder
        title={UI_COPY.dashboard.comingSoonTitle}
        description={UI_COPY.dashboard.comingSoonDescription}
      />

      <View style={styles.actions}>
        <AppButton
          onPress={() =>
            navigation.navigate(NAVIGATION_ROUTES.tabs.explore)
          }
        >
          {UI_COPY.dashboard.discoverRoadmaps}
        </AppButton>
        <AppButton
          variant="outline"
          onPress={() =>
            navigation.navigate(NAVIGATION_ROUTES.tabs.learning)
          }
        >
          {UI_COPY.dashboard.activeLearning}
        </AppButton>
      </View>
    </Screen>
  );
}
