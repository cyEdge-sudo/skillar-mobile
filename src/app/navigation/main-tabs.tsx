import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FEATURE_FLAGS, NAVIGATION_LABELS, NAVIGATION_ROUTES } from "../../core/constants/app.constants";
import { DashboardScreen } from "../../features/dashboard";
import { LearningScreen, useLearningEnrollments } from "../../features/learning";
import { JourneysScreen } from "../../features/journeys";
import { ProfileScreen } from "../../features/profile";
import { ExploreScreen } from "../../features/roadmaps";
import { useTheme } from "../../shared/theme";
import type { MainTabParamList } from "./navigation-types";

const Tab = createBottomTabNavigator<MainTabParamList>();

function ExploreTabScreen() {
  const enrollmentsQuery = useLearningEnrollments();
  const enrollmentsByRoadmapId = new Map(
    (enrollmentsQuery.data?.pages.flatMap((page) => page.items) ?? []).map(
      (enrollment) => [enrollment.roadmapId, enrollment.enrollmentId] as const,
    ),
  );

  return <ExploreScreen enrollmentsByRoadmapId={enrollmentsByRoadmapId} />;
}

export function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
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
      <Tab.Screen
        name={NAVIGATION_ROUTES.tabs.dashboard}
        component={DashboardScreen}
        options={{ title: NAVIGATION_LABELS.dashboard }}
      />
      <Tab.Screen
        name={NAVIGATION_ROUTES.tabs.explore}
        component={ExploreTabScreen}
        options={{ title: NAVIGATION_LABELS.explore }}
      />
      <Tab.Screen
        name={NAVIGATION_ROUTES.tabs.learning}
        component={LearningScreen}
        options={{ title: NAVIGATION_LABELS.learning }}
      />
      {FEATURE_FLAGS.journeys ? (
        <Tab.Screen
          name={NAVIGATION_ROUTES.tabs.journeys}
          component={JourneysScreen}
          options={{ title: NAVIGATION_LABELS.journeys }}
        />
      ) : null}
      <Tab.Screen
        name={NAVIGATION_ROUTES.tabs.profile}
        component={ProfileScreen}
        options={{ title: NAVIGATION_LABELS.profile }}
      />
    </Tab.Navigator>
  );
}
