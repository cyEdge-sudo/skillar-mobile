import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ForgotPasswordScreen, LoginScreen, SignupScreen } from "../../features/auth";
import { NAVIGATION_ROUTES, UI_COPY } from "../../core/constants/app.constants";
import { useTheme } from "../../shared/theme";
import type { AuthStackParamList } from "./navigation-types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={NAVIGATION_ROUTES.auth.login}
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.login}
        component={LoginScreen}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.signup}
        component={SignupScreen}
        options={{ title: UI_COPY.auth.signupTitle }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.forgotPassword}
        component={ForgotPasswordScreen}
        options={{ title: UI_COPY.auth.resetTitle }}
      />
    </Stack.Navigator>
  );
}
