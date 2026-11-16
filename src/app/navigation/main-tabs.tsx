import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { DashboardScreen } from "../../features/dashboard/screens/dashboard-screen";
import { ExploreScreen } from "../../features/roadmaps/screens/explore-screen";
import { LearningScreen } from "../../features/learning/screens/learning-screen";
import { ProfileScreen } from "../../features/profile/screens/profile-screen";
import type { MainTabParamList } from "./navigation-types";
import { colors } from "../../shared/theme/tokens";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 62,
          paddingTop: 7,
          paddingBottom: 7,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Learning" component={LearningScreen} options={{ title: "My Learning" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
