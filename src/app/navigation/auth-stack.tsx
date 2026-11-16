import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ForgotPasswordScreen } from "../../features/auth/screens/forgot-password-screen";
import { LoginScreen } from "../../features/auth/screens/login-screen";
import { SignupScreen } from "../../features/auth/screens/signup-screen";
import type { AuthStackParamList } from "./navigation-types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#F7F7FB" },
        contentStyle: { backgroundColor: "#F7F7FB" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} options={{ title: "Create account" }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Reset password" }} />
    </Stack.Navigator>
  );
}
