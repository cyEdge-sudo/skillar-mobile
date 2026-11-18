import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface LandingScreenProps {
  onOpenLogin: () => void;
}

export function LandingScreen({ onOpenLogin }: LandingScreenProps) {
  // Staggered entrance animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.85)).current;
  const copyFade = useRef(new Animated.Value(0)).current;
  const copyTranslateY = useRef(new Animated.Value(20)).current;
  const artFade = useRef(new Animated.Value(0)).current;
  const artScale = useRef(new Animated.Value(0.88)).current;
  const chip1Anim = useRef(new Animated.Value(0)).current;
  const chip1Scale = useRef(new Animated.Value(0.5)).current;
  const chip2Anim = useRef(new Animated.Value(0)).current;
  const chip2Scale = useRef(new Animated.Value(0.5)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Choreographed spring/timing sequence
    Animated.stagger(85, [
      // 1. Header bounce in
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(headerScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      // 2. Headline & Lede slide-up fade
      Animated.parallel([
        Animated.timing(copyFade, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(copyTranslateY, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),

      // 3. Playful Art Card pop & spring
      Animated.parallel([
        Animated.timing(artFade, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(artScale, {
          toValue: 1,
          friction: 6,
          tension: 65,
          useNativeDriver: true,
        }),
      ]),

      // 4. Floating Streak Badge pop (Yellow 🔥 7 Day Streak)
      Animated.parallel([
        Animated.timing(chip1Anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.spring(chip1Scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),

      // 5. Floating XP Badge pop (Mint ⚡ +15 XP)
      Animated.parallel([
        Animated.timing(chip2Anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.spring(chip2Scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),

      // 6. CTA Button slide into place
      Animated.parallel([
        Animated.timing(ctaFade, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(ctaTranslateY, {
          toValue: 0,
          friction: 6.5,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Progress bar fill animation inside the art card
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [
    headerAnim,
    headerScale,
    copyFade,
    copyTranslateY,
    artFade,
    artScale,
    chip1Anim,
    chip1Scale,
    chip2Anim,
    chip2Scale,
    ctaFade,
    ctaTranslateY,
    progressAnim,
  ]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '64%'],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Header: Clean Brand Logo with Bounce Pop */}
        <Animated.View
          style={[
            styles.topHeader,
            {
              opacity: headerAnim,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <View style={styles.logoGroup}>
            <View style={styles.logoBadge} accessibilityRole="image" accessibilityLabel="Skillar Logo">
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
            </View>
            <Text style={styles.brandTitle}>Skillar</Text>
          </View>
        </Animated.View>

        {/* Hero Headline & Lede Copy with Staggered Rise */}
        <Animated.View
          style={[
            styles.copyBlock,
            {
              opacity: copyFade,
              transform: [{ translateY: copyTranslateY }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>Keep learning moving.</Text>
          <Text style={styles.heroLede}>
            Your organization&apos;s roadmap, turned into short guided sessions — so progress keeps
            happening between meetings, not just at review time.
          </Text>
        </Animated.View>

        {/* Interactive Playful Art Illustration Card with Elastic Spring */}
        <Animated.View
          style={[
            styles.artFrame,
            {
              opacity: artFade,
              transform: [{ scale: artScale }],
            },
          ]}
        >
          {/* Background Decorative Playful Blobs */}
          <View style={[styles.artBlob, styles.blobPurple]} />
          <View style={[styles.artBlob, styles.blobYellow]} />
          <View style={[styles.artBlob, styles.blobMint]} />

          {/* Floating Sticker 1: 🔥 7 Day Streak (Top-Right) */}
          <Animated.View
            style={[
              styles.floatingStickerStreak,
              {
                opacity: chip1Anim,
                transform: [{ scale: chip1Scale }, { rotate: '7deg' }],
              },
            ]}
          >
            <View style={styles.stickerInner}><Ionicons name="flame" size={12} color="#B85000" /><Text style={styles.stickerStreakText}> 7 Day Streak</Text></View>
          </Animated.View>

          {/* Floating Sticker 2: ⚡ +15 XP (Bottom-Left) */}
          <Animated.View
            style={[
              styles.floatingStickerXp,
              {
                opacity: chip2Anim,
                transform: [{ scale: chip2Scale }, { rotate: '-6deg' }],
              },
            ]}
          >
            <View style={styles.stickerInner}><Ionicons name="flash" size={12} color="#007A6A" /><Text style={styles.stickerXpText}> +15 XP</Text></View>
          </Animated.View>

          {/* Angled Hero Art Card */}
          <View style={styles.floatingCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardPulseDot} />
              <Text style={styles.cardHeaderLabel}>TODAY&apos;S JOURNEY</Text>
              <View style={styles.cardTagPill}>
                <Text style={styles.cardTagText}>React 19</Text>
              </View>
            </View>

            <Text style={styles.cardTrackTitle}>React performance</Text>

            {/* Chunky Animated Progress Track */}
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            <View style={styles.cardFooterRow}>
              <Text style={styles.cardMetaText}>7 of 11 steps</Text>
              <Text style={styles.cardTimeText}>⏱ 12 min left</Text>
            </View>
          </View>
        </Animated.View>

        {/* Primary Call to Action Button with Smooth Spring */}
        <Animated.View
          style={[
            styles.ctaWrapper,
            {
              opacity: ctaFade,
              transform: [{ translateY: ctaTranslateY }],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={onOpenLogin}
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && styles.btnPrimaryPressed,
            ]}
          >
            <Text style={styles.btnPrimaryText}>Sign in</Text>
          </Pressable>
        </Animated.View>

        {/* Footer Info */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Employee learning · Provisioned for your team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Canonical Playful warm vanilla canvas
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  /* ── Header ── */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 16,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#6C47FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 8,
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  bar: {
    width: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2.5,
  },
  bar1: {
    height: 10,
    opacity: 0.75,
  },
  bar2: {
    height: 17,
    opacity: 0.9,
  },
  bar3: {
    height: 24,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: -0.5,
  },

  /* ── Hero Copy ── */
  copyBlock: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1E1A3D',
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: 12,
  },
  heroLede: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '600',
    color: '#6A648F',
  },

  /* ── Playful Art Frame ── */
  artFrame: {
    height: 215,
    backgroundColor: '#FFF0F5',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  artBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobPurple: {
    width: 150,
    height: 150,
    backgroundColor: '#6C47FF',
    opacity: 0.22,
    top: -45,
    right: -25,
  },
  blobYellow: {
    width: 100,
    height: 100,
    backgroundColor: '#FFC024',
    opacity: 0.5,
    bottom: -25,
    left: -25,
  },
  blobMint: {
    width: 65,
    height: 65,
    backgroundColor: '#00D4B4',
    opacity: 0.45,
    top: 25,
    left: 25,
  },

  /* ── Floating Stickers ── */
  floatingStickerStreak: {
    position: 'absolute',
    top: 14,
    right: 18,
    backgroundColor: '#FFC024',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    zIndex: 10,
  },
  stickerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerStreakText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: 0.2,
  },
  floatingStickerXp: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    backgroundColor: '#00D4B4',
    borderWidth: 2,
    borderColor: '#1E1A3D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    zIndex: 10,
  },
  stickerXpText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1E1A3D',
    letterSpacing: 0.2,
  },

  /* ── Angled Hero Card ── */
  floatingCard: {
    width: 255,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    borderRadius: 18,
    padding: 15,
    transform: [{ rotate: '-3deg' }],
    shadowColor: '#1E1A3D',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#6C47FF',
  },
  cardHeaderLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#6A648F',
    flex: 1,
  },
  cardTagPill: {
    backgroundColor: '#F4EFFF',
    borderWidth: 1.5,
    borderColor: '#1E1A3D',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6C47FF',
  },
  cardTrackTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1A3D',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  progressTrack: {
    height: 9,
    backgroundColor: '#EDE7FF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#1E1A3D',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C47FF',
    borderRadius: 999,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMetaText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6A648F',
  },
  cardTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A84AC',
  },

  /* ── Action CTA Button ── */
  ctaWrapper: {
    marginTop: 18,
    marginBottom: 12,
  },
  btnPrimary: {
    height: 52,
    backgroundColor: '#6C47FF',
    borderWidth: 2.5,
    borderColor: '#1E1A3D',
    borderRadius: 16,
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
  btnPrimaryText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* ── Footer ── */
  footerRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  footerText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8A84AC',
    textAlign: 'center',
  },
});
