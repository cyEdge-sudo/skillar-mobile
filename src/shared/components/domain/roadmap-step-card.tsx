import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useTheme, type DesignSystem } from '@/shared/theme';
import { AppBadge, AppBadgeVariant } from '../display/app-badge';
import { AppProgress } from '../display/app-progress';

export type RoadmapStepStatus =
  | 'locked'
  | 'not_started'
  | 'in_progress'
  | 'completed';

export interface RoadmapStepCardProps extends Omit<ViewProps, 'style'> {
  /**
   * Sequence or step number in the roadmap milestone.
   */
  stepNumber: number;

  /**
   * Title of the roadmap step.
   */
  title: string;

  /**
   * Optional summary or learning outcomes description.
   */
  description?: string;

  /**
   * Learner progress status for this step.
   * - `locked`: Inaccessible / prereq not met
   * - `not_started`: Available to begin
   * - `in_progress`: Started and partially completed
   * - `completed`: Fully finished
   */
  status: RoadmapStepStatus;

  /**
   * Current completion percentage (0 - 100).
   * Displayed when status is 'in_progress' or explicitly defined.
   */
  progressPercent?: number;

  /**
   * Estimated duration in minutes to complete this step.
   */
  estimatedMinutes?: number;

  /**
   * Optional press handler to open or view step details.
   */
  onPress?: () => void;

  /**
   * Outer card container style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Automation test identifier.
   */
  testID?: string;
}

export const RoadmapStepCard = React.forwardRef<any, RoadmapStepCardProps>(
  (
    {
      stepNumber,
      title,
      description,
      status,
      progressPercent,
      estimatedMinutes,
      onPress,
      style,
      testID,
      accessibilityLabel,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useThemedStyles(createStyles);

    const isLocked = status === 'locked';
    const isInteractive = Boolean(onPress) && !isLocked;

    // Status pill badge mapping
    const getStatusBadgeConfig = (): {
      label: string;
      variant: AppBadgeVariant;
      icon?: React.ReactNode;
    } => {
      switch (status) {
        case 'completed':
          return {
            label: 'Completed',
            variant: 'success',
            icon: (
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={theme.colors.success}
              />
            ),
          };
        case 'in_progress':
          return {
            label: 'In Progress',
            variant: 'primary',
            icon: (
              <Ionicons
                name="play-circle"
                size={12}
                color={theme.colors.primary}
              />
            ),
          };
        case 'not_started':
          return {
            label: 'Not Started',
            variant: 'neutral',
          };
        case 'locked':
        default:
          return {
            label: 'Locked',
            variant: 'neutral',
            icon: (
              <Ionicons
                name="lock-closed"
                size={11}
                color={theme.colors.textMuted}
              />
            ),
          };
      }
    };

    const badgeConfig = getStatusBadgeConfig();

    const showProgress =
      (status === 'in_progress' || status === 'completed') &&
      progressPercent !== undefined;

    const resolvedA11yLabel =
      accessibilityLabel ??
      `Step ${stepNumber}: ${title}. Status: ${badgeConfig.label}.${
        estimatedMinutes ? ` Estimated duration ${estimatedMinutes} minutes.` : ''
      }${
        progressPercent !== undefined
          ? ` Progress ${Math.round(progressPercent)} percent.`
          : ''
      }`;

    const cardContent = (
      <>
        {/* Header: Step Number & Status Badge */}
        <View style={styles.headerRow}>
          <AppBadge
            variant="neutral"
            size="sm"
            label={`Step ${stepNumber}`}
            accessibilityLabel={`Step number ${stepNumber}`}
          />
          <AppBadge
            variant={badgeConfig.variant}
            size="sm"
            label={badgeConfig.label}
            icon={badgeConfig.icon}
          />
        </View>

        {/* Title & Description */}
        <View style={styles.body}>
          <Text
            style={[styles.title, isLocked && styles.titleLocked]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {description ? (
            <Text
              style={[styles.description, isLocked && styles.descriptionLocked]}
              numberOfLines={3}
            >
              {description}
            </Text>
          ) : null}
        </View>

        {/* Progress Bar (when in-progress or completed) */}
        {showProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>
                {Math.round(progressPercent)}%
              </Text>
            </View>
            <AppProgress
              value={progressPercent}
              variant={status === 'completed' ? 'success' : 'primary'}
              size="sm"
              accessibilityLabel={`Step progress ${Math.round(progressPercent)}%`}
            />
          </View>
        )}

        {/* Footer: Metadata & Chevron */}
        <View style={styles.footerRow}>
          {estimatedMinutes !== undefined ? (
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textMuted}
              />
              <Text style={styles.metaText}>{estimatedMinutes} min</Text>
            </View>
          ) : (
            <View />
          )}

          {isInteractive && (
            <View style={styles.actionIconWrapper}>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.primary}
              />
            </View>
          )}

          {isLocked && (
            <View style={styles.metaItem}>
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={theme.colors.textMuted}
              />
            </View>
          )}
        </View>
      </>
    );

    if (isInteractive) {
      return (
        <Pressable
          ref={ref}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={resolvedA11yLabel}
          accessibilityState={{ disabled: false }}
          android_ripple={{
            color: theme.colors.border,
            borderless: false,
          }}
          style={({ pressed }) => [
            styles.cardBase,
            styles.cardInteractive,
            pressed && Platform.OS !== 'android' && styles.cardPressed,
            style,
          ]}
          testID={testID}
          {...rest}
        >
          {cardContent}
        </Pressable>
      );
    }

    return (
      <View
        ref={ref}
        style={[
          styles.cardBase,
          isLocked && styles.cardLocked,
          style,
        ]}
        accessibilityRole="summary"
        accessibilityLabel={resolvedA11yLabel}
        accessibilityState={{ disabled: isLocked }}
        testID={testID}
        {...rest}
      >
        {cardContent}
      </View>
    );
  },
);

RoadmapStepCard.displayName = 'RoadmapStepCard';

const createStyles = (theme: DesignSystem) => {
  const { colors, opacity, radius, spacing, typography } = theme;

  return StyleSheet.create({
    cardBase: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing[4],
      gap: spacing[3],
      width: '100%',
      minHeight: spacing.minTouchTarget,
    },
    cardInteractive: {
      // Elevated slightly for interactive items
    },
    cardPressed: {
      opacity: opacity.pressed,
    },
    cardLocked: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      opacity: opacity.disabled,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    body: {
      gap: spacing[1],
    },
    title: {
      fontSize: typography.h4.fontSize,
      lineHeight: typography.h4.lineHeight,
      fontWeight: typography.h4.fontWeight,
      color: colors.text,
    },
    titleLocked: {
      color: colors.textMuted,
    },
    description: {
      fontSize: typography.sm.fontSize,
      lineHeight: typography.sm.lineHeight + 2,
      fontWeight: '400',
      color: colors.textMuted,
    },
    descriptionLocked: {
      color: colors.textDisabled,
    },

    progressSection: {
      gap: spacing[1],
      marginTop: spacing[1],
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressLabel: {
      fontSize: typography.sm.fontSize - 1,
      lineHeight: typography.sm.lineHeight,
      fontWeight: '500',
      color: colors.textMuted,
    },
    progressValue: {
      fontSize: typography.sm.fontSize - 1,
      lineHeight: typography.sm.lineHeight,
      fontWeight: '600',
      color: colors.text,
    },

    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing[1],
      minHeight: 20,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    metaText: {
      fontSize: typography.sm.fontSize,
      lineHeight: typography.sm.lineHeight,
      fontWeight: '400',
      color: colors.textMuted,
    },
    actionIconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
    },
  });
};
