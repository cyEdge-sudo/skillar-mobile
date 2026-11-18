import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ForgotPasswordScreen,
  LandingScreen,
  LoginScreen,
  SignupScreen,
} from '../../features/auth';
import { NAVIGATION_ROUTES, UI_COPY } from '../../core/constants/app.constants';
import { useTheme } from '../../shared/theme';
import type { AuthStackParamList } from './navigation-types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function LandingRouteScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <LandingScreen
      onOpenLogin={() => navigation.navigate(NAVIGATION_ROUTES.auth.login)}
    />
  );
}

function LoginRouteScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <LoginScreen
      onGoBack={() => navigation.navigate(NAVIGATION_ROUTES.auth.landing)}
      onOpenForgotPassword={() => navigation.navigate(NAVIGATION_ROUTES.auth.forgotPassword)}
    />
  );
}

function SignupRouteScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return <SignupScreen onOpenLogin={() => navigation.navigate(NAVIGATION_ROUTES.auth.login)} />;
}

function ForgotPasswordRouteScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  return (
    <ForgotPasswordScreen onOpenLogin={() => navigation.navigate(NAVIGATION_ROUTES.auth.login)} />
  );
}

export function AuthStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={NAVIGATION_ROUTES.auth.landing}
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.landing}
        component={LandingRouteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.login}
        component={LoginRouteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.signup}
        component={SignupRouteScreen}
        options={{ title: UI_COPY.auth.signupTitle }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.auth.forgotPassword}
        component={ForgotPasswordRouteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
