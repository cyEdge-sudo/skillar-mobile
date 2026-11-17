import { Alert, StyleSheet, View } from 'react-native';

import { useAuth } from '../../../core/auth/auth-context';
import { APP_CONSTANTS, UI_COPY } from '../../../core/constants/app.constants';
import { AppButton, AppText, Screen } from '../../../shared/components';
import { useTheme } from '../../../shared/theme';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { colors, spacing, radius } = useTheme();

  const styles = StyleSheet.create({
    content: {
      gap: spacing[20],
    },
    profileCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius[16],
      backgroundColor: colors.surface,
      padding: spacing[20],
      gap: spacing[8],
    },
    email: {
      marginTop: spacing[4],
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      Alert.alert(APP_CONSTANTS.NAME, UI_COPY.profile.signOutFailed);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText variant="displaySmall">{UI_COPY.profile.title}</AppText>

      <View style={styles.profileCard}>
        <AppText variant="titleLarge">{user?.name ?? UI_COPY.profile.title}</AppText>
        {user?.email ? (
          <AppText color="textSecondary" style={styles.email}>
            {user.email}
          </AppText>
        ) : null}
      </View>

      <AppButton variant="outline" onPress={() => void handleSignOut()}>
        {UI_COPY.profile.signOut}
      </AppButton>

      <AppText color="textSecondary" variant="caption">
        {UI_COPY.profile.signOutDescription}
      </AppText>
    </Screen>
  );
}
