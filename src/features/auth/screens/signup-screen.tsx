import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '../../../core/auth/auth-context';
import { FORM_VALIDATION, UI_COPY } from '../../../core/constants/app.constants';
import { isValidDateOnly, isValidEmail, normalizeEmail } from '../../../core/auth/input-validation';
import { getErrorMessage } from '../../../core/api/api-error';
import { AppButton, AppText, FormField, Screen } from '../../../shared/components';
import { useTheme } from '../../../shared/theme';

export interface SignupScreenProps {
  onOpenLogin: () => void;
}

export function SignupScreen({ onOpenLogin }: SignupScreenProps) {
  const { signUp } = useAuth();
  const { colors, spacing } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = StyleSheet.create({
    content: {
      gap: spacing[20],
      paddingBottom: spacing[40],
    },
    heading: {
      gap: spacing[8],
    },
    notice: {
      padding: spacing[12],
      borderRadius: spacing[8],
      backgroundColor: colors.success + '14',
    },
    error: {
      padding: spacing[12],
      borderRadius: spacing[8],
      backgroundColor: colors.error + '14',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing[8],
      flexWrap: 'wrap',
    },
    link: {
      color: colors.primary,
      fontWeight: '700',
    },
  });

  const handleSignup = async () => {
    setError(null);

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = name.trim();

    if (!normalizedName || !normalizedEmail || !password || !dateOfBirth) {
      setError(UI_COPY.auth.requiredFields);
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError(UI_COPY.auth.invalidEmail);
      return;
    }

    if (password.length < FORM_VALIDATION.passwordMinLength) {
      setError(UI_COPY.auth.passwordTooShort);
      return;
    }

    if (!isValidDateOnly(dateOfBirth)) {
      setError(UI_COPY.auth.invalidDateOfBirth);
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: normalizedName,
        email: normalizedEmail,
        password,
        dateOfBirth,
      });
      setSuccess(true);
    } catch (signupError: unknown) {
      setError(getErrorMessage(signupError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <AppText variant="displaySmall">{UI_COPY.auth.signupTitle}</AppText>
        <AppText color="textSecondary">{UI_COPY.auth.signupSubtitle}</AppText>
      </View>

      <FormField
        label={UI_COPY.auth.nameLabel}
        value={name}
        onChangeText={setName}
        placeholder={UI_COPY.auth.namePlaceholder}
        autoCapitalize="words"
        autoComplete="name"
      />

      <FormField
        label={UI_COPY.auth.emailLabel}
        value={email}
        onChangeText={setEmail}
        placeholder={UI_COPY.auth.emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
      />

      <FormField
        label={UI_COPY.auth.passwordLabel}
        value={password}
        onChangeText={setPassword}
        placeholder={UI_COPY.auth.passwordPlaceholder}
        secureTextEntry
        autoComplete="new-password"
      />

      <FormField
        label={UI_COPY.auth.dateOfBirthLabel}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder={UI_COPY.auth.dateOfBirthPlaceholder}
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
      />

      {error ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <AppText color="error">{error}</AppText>
        </View>
      ) : null}

      {success ? (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <AppText color="success">{UI_COPY.auth.signupSuccess}</AppText>
        </View>
      ) : (
        <AppButton loading={isSubmitting} onPress={() => void handleSignup()}>
          {UI_COPY.auth.createAccountAction}
        </AppButton>
      )}

      <View style={styles.footer}>
        <AppText color="textSecondary">{UI_COPY.auth.haveAccount}</AppText>
        <Pressable accessibilityRole="button" onPress={onOpenLogin}>
          <AppText style={styles.link}>{UI_COPY.auth.loginAction}</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
