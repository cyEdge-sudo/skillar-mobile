import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "../../../core/auth/auth-context";
import { UI_COPY } from "../../../core/constants/app.constants";
import { isValidEmail, normalizeEmail } from "../../../core/auth/input-validation";
import { getErrorMessage } from "../../../core/api/api-error";
import { AppButton, AppText, FormField, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";

export interface ForgotPasswordScreenProps {
  onOpenLogin: () => void;
}

export function ForgotPasswordScreen({ onOpenLogin }: ForgotPasswordScreenProps) {
  const { colors, spacing } = useTheme();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = StyleSheet.create({
    content: {
      flexGrow: 1,
      justifyContent: "center",
      gap: spacing[20],
    },
    heading: {
      gap: spacing[8],
    },
    notice: {
      padding: spacing[12],
      borderRadius: spacing[8],
      backgroundColor: colors.success + "14",
    },
    error: {
      padding: spacing[12],
      borderRadius: spacing[8],
      backgroundColor: colors.error + "14",
    },
  });

  const handleSubmit = async () => {
    setError(null);
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      setError(UI_COPY.auth.invalidEmail);
      return;
    }

    setIsSubmitting(true);
    try {
      await requestPasswordReset(normalizedEmail);
      setSubmitted(true);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <AppText variant="displaySmall">{UI_COPY.auth.resetTitle}</AppText>
        <AppText color="textSecondary">{UI_COPY.auth.resetSubtitle}</AppText>
      </View>

      <FormField
        label={UI_COPY.auth.emailLabel}
        value={email}
        onChangeText={setEmail}
        placeholder={UI_COPY.auth.emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
      />

      {error ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <AppText color="error">{error}</AppText>
        </View>
      ) : null}

      {submitted ? (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <AppText color="success">{UI_COPY.auth.resetRequestSent}</AppText>
        </View>
      ) : (
        <AppButton
          loading={isSubmitting}
          onPress={() => void handleSubmit()}
        >
          {UI_COPY.auth.sendResetAction}
        </AppButton>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={onOpenLogin}
      >
        <AppText color="primary" style={{ textAlign: "center" }}>
          {UI_COPY.common.back}
        </AppText>
      </Pressable>
    </Screen>
  );
}
