import { NavigationContainer } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../../core/auth/auth-context";
import {
  APP_MESSAGES,
  FEATURE_FLAGS,
  NAVIGATION_ROUTES,
  AUTH_STATUS,
  UI_COPY,
} from "../../core/constants/app.constants";
import { StepContentScreen } from "../../features/learning";
import type { StepContentRouteParams } from "../../features/learning";
import { JourneyDetailScreen } from "../../features/journeys";
import { RoadmapDetailScreen } from "./roadmap-detail-screen";
import { AppText, AppButton } from "../../shared/components/themed";
import { useTheme } from "../../shared/theme";
import { AuthStack } from "./auth-stack";
import { MainTabs } from "./main-tabs";
import type { RootStackParamList } from "./navigation-types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function StepContentRouteScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, typeof NAVIGATION_ROUTES.root.stepContent>) {
  return (
    <StepContentScreen
      routeParams={route.params}
      onGoBack={() => navigation.goBack()}
      onReplaceStep={(params: StepContentRouteParams) => navigation.replace(NAVIGATION_ROUTES.root.stepContent, params)}
    />
  );
}

function JourneyDetailRouteScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, typeof NAVIGATION_ROUTES.root.journeyDetail>) {
  return (
    <JourneyDetailScreen
      enrollmentId={route.params.enrollmentId}
      onGoBack={() => navigation.goBack()}
      onOpenRoadmap={(roadmapId) => navigation.navigate(NAVIGATION_ROUTES.root.roadmapDetail, { roadmapId })}
    />
  );
}

function SessionRestoreScreen() {
  const { error, retrySessionRestore } = useAuth();
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing[32],
      backgroundColor: colors.background,
    },
    message: {
      marginTop: spacing[16],
      textAlign: "center",
    },
    title: {
      marginBottom: spacing[8],
      textAlign: "center",
    },
    button: {
      marginTop: spacing[16],
    },
  });

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <AppText variant="titleLarge" style={styles.title}>
            {APP_MESSAGES.restoreSessionFailed}
          </AppText>
          <AppText color="textSecondary" style={styles.message}>
            {error}
          </AppText>
          <AppButton
            style={styles.button}
            onPress={() => void retrySessionRestore()}
          >
            {UI_COPY.common.retry}
          </AppButton>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText color="textSecondary" style={styles.message}>
            {UI_COPY.common.loading}
          </AppText>
        </>
      )}
    </View>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  return (
    <NavigationContainer>
      {status === AUTH_STATUS.RESTORING || status === AUTH_STATUS.ERROR ? (
        <SessionRestoreScreen />
      ) : status === AUTH_STATUS.AUTHENTICATED ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={NAVIGATION_ROUTES.root.mainTabs} component={MainTabs} />
          <Stack.Screen name={NAVIGATION_ROUTES.root.roadmapDetail} component={RoadmapDetailScreen} />
          <Stack.Screen name={NAVIGATION_ROUTES.root.stepContent} component={StepContentRouteScreen} />
          {FEATURE_FLAGS.journeys ? (
            <Stack.Screen name={NAVIGATION_ROUTES.root.journeyDetail} component={JourneyDetailRouteScreen} />
          ) : null}
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
