import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "../../../core/auth/auth-context";
import { FORM_VALIDATION, UI_COPY } from "../../../core/constants/app.constants";
import { getErrorMessage } from "../../../core/api/api-error";
import { AppButton, AppText, FormField, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";

export interface LoginScreenProps {
  onOpenForgotPassword: () => void;
  onOpenSignup: () => void;
}

export function LoginScreen({ onOpenForgotPassword, onOpenSignup }: LoginScreenProps) {
  const { signIn } = useAuth();
  const { colors, spacing } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = StyleSheet.create({
    content: {
      flexGrow: 1,
      justifyContent: "center",
      gap: spacing[20],
    },
    heading: {
      gap: spacing[8],
      marginBottom: spacing[8],
    },
    links: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing[8],
    },
    link: {
      color: colors.primary,
      fontWeight: "700",
    },
    error: {
      padding: spacing[12],
      borderRadius: spacing[8],
      backgroundColor: colors.error + "14",
    },
  });

  const handleLogin = async () => {
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError(UI_COPY.auth.requiredFields);
      return;
    }

    if (!FORM_VALIDATION.emailPattern.test(normalizedEmail)) {
      setError(UI_COPY.auth.invalidEmail);
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({ email: normalizedEmail, password });
    } catch (loginError: unknown) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <AppText variant="displaySmall">{UI_COPY.auth.loginTitle}</AppText>
        <AppText color="textSecondary">{UI_COPY.auth.loginSubtitle}</AppText>
      </View>

      <FormField
        label={UI_COPY.auth.emailLabel}
        value={email}
        onChangeText={setEmail}
        placeholder={UI_COPY.auth.emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        returnKeyType="next"
      />

      <FormField
        label={UI_COPY.auth.passwordLabel}
        value={password}
        onChangeText={setPassword}
        placeholder={UI_COPY.auth.passwordPlaceholder}
        secureTextEntry
        autoComplete="current-password"
        returnKeyType="done"
      />

      {error ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <AppText color="error">{error}</AppText>
        </View>
      ) : null}

      <AppButton loading={isSubmitting} onPress={() => void handleLogin()}>
        {UI_COPY.auth.loginAction}
      </AppButton>

      <Pressable
        accessibilityRole="button"
        onPress={onOpenForgotPassword}
      >
        <AppText color="primary" style={{ textAlign: "center" }}>
          {UI_COPY.auth.forgotPasswordAction}
        </AppText>
      </Pressable>

      <View style={styles.links}>
        <AppText color="textSecondary">{UI_COPY.auth.noAccount}</AppText>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenSignup}
        >
          <AppText style={styles.link}>{UI_COPY.auth.signupAction}</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
