import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getErrorMessage } from '../../../core/api/api-error';
import { useAuth } from '../../../core/auth/auth-context';
import { isValidEmail, normalizeEmail } from '../../../core/auth/input-validation';
import { UI_COPY } from '../../../core/constants/app.constants';

export interface ForgotPasswordScreenProps {
  onOpenLogin: () => void;
}

export function ForgotPasswordScreen({ onOpenLogin }: ForgotPasswordScreenProps) {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(16)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(headerAnim, { toValue: 1, duration: 320, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(headerScale, { toValue: 1, friction: 6, tension: 75, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(heroAnim, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(heroY, { toValue: 0, friction: 7, tension: 65, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(cardTranslateY, { toValue: 0, friction: 6.5, tension: 70, useNativeDriver: true }),
      ]),
    ]).start();
  }, [headerAnim, headerScale, heroAnim, heroY, cardAnim, cardTranslateY]);

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <Animated.View style={[styles.topBar, { opacity: headerAnim, transform: [{ scale: headerScale }] }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to sign in"
            onPress={onOpenLogin}
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1A3D" />
          </Pressable>
          <View style={styles.brandGroup}>
            <View style={styles.logoBadge} accessibilityRole="image" accessibilityLabel="Skillar Logo">
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
            </View>
            <Text style={styles.brandTitle}>Skillar</Text>
          </View>
          <View style={styles.backPlaceholder} />
        </Animated.View>

        {/* ── Hero Block ── */}
        <Animated.View style={[styles.heroBlock, { opacity: heroAnim, transform: [{ translateY: heroY }] }]}>
          <Text style={styles.heroEyebrow}>No worries!</Text>
          <Text style={styles.heroTitle}>{'Reset your\npassword.'}</Text>
          <Text style={styles.heroSub}>
            Enter your work email and we'll send you a secure link to get back in.
          </Text>
          {/* Lock icon illustration */}
          <View style={styles.lockIllustration}>
            <View style={styles.lockIconBadge}>
              <Ionicons name="lock-closed" size={28} color="#6C47FF" />
            </View>
            <View style={styles.lockDotRow}>
              <View style={[styles.lockDot, { backgroundColor: '#6C47FF' }]} />
              <View style={[styles.lockDot, { backgroundColor: '#00D4B4' }]} />
              <View style={[styles.lockDot, { backgroundColor: '#FFC024' }]} />
            </View>
          </View>
        </Animated.View>

        {/* ── Card ── */}
        <Animated.View style={[styles.authCard, { opacity: cardAnim, transform: [{ translateY: cardTranslateY }] }]}>
          {submitted ? (
            /* ── Success State ── */
            <View style={styles.successContainer}>
              <View style={styles.successIconBadge}>
                <Ionicons name="mail" size={36} color="#6C47FF" />
              </View>
              <Text style={styles.successHeading}>Check your inbox!</Text>
              <Text style={styles.successText}>{UI_COPY.auth.resetRequestSent}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onOpenLogin}
                style={({ pressed }) => [styles.btnOutline, pressed && styles.btnOutlinePressed]}
              >
                <Ionicons name="arrow-back" size={16} color="#1E1A3D" style={{ marginRight: 6 }} />
                <Text style={styles.btnOutlineText}>Back to sign in</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Email Field */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{UI_COPY.auth.emailLabel}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#8F8AAB" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={UI_COPY.auth.emailPlaceholder}
                    placeholderTextColor="#8F8AAB"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={() => void handleSubmit()}
                  />
                </View>
              </View>

              {/* Error */}
              {error ? (
                <View style={styles.errorBanner} accessibilityLiveRegion="polite">
                  <Ionicons name="alert-circle" size={16} color="#B80036" style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Send Reset Button */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={UI_COPY.auth.sendResetAction}
                disabled={isSubmitting}
                onPress={() => void handleSubmit()}
                style={({ pressed }) => [
                  styles.btnPrimary,
                  pressed && styles.btnPrimaryPressed,
                  isSubmitting && styles.btnDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.btnPrimaryText}>{UI_COPY.auth.sendResetAction}</Text>
                    <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </>
                )}
              </Pressable>

              {/* Back link */}
              <Pressable accessibilityRole="button" onPress={onOpenLogin} style={styles.backLinkWrapper}>
                <Ionicons name="arrow-back" size={14} color="#6C47FF" style={{ marginRight: 4 }} />
                <Text style={styles.backLinkText}>Back to sign in</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },

  /* ── Top Bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  backBtnPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 0 },
  },
  backPlaceholder: {
    width: 40,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#6C47FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3.5,
    paddingBottom: 7,
    borderWidth: 2,
    borderColor: '#1E1A3D',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  bar: {
    width: 4.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2.5,
  },
  bar1: { height: 9, opacity: 0.75 },
  bar2: { height: 15, opacity: 0.9 },
  bar3: { height: 21 },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: -0.5,
  },

  /* ── Hero Block ── */
  heroBlock: {
    marginBottom: 28,
    paddingLeft: 2,
  },
  heroEyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C47FF',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A648F',
    lineHeight: 20,
    marginBottom: 20,
  },
  lockIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  lockIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EDE8FF',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  lockDotRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  lockDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E1A3D',
  },

  /* ── Auth Card ── */
  authCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    gap: 14,
  },

  /* ── Form ── */
  fieldWrapper: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E1A3D',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4FF',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1A3D',
  },

  /* ── Error ── */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5EC',
    borderWidth: 2,
    borderColor: '#FF4B72',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B80036',
    flex: 1,
  },

  /* ── Buttons ── */
  btnPrimary: {
    height: 52,
    backgroundColor: '#6C47FF',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnPrimaryPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 1 },
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  btnOutline: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnOutlinePressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 1 },
  },
  btnOutlineText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1A3D',
  },
  backLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6C47FF',
  },

  /* ── Success State ── */
  successContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EDE8FF',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    marginBottom: 4,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: -0.4,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A648F',
    textAlign: 'center',
    lineHeight: 20,
  },
});
