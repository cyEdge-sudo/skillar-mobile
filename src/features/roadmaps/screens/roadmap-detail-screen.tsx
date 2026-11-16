import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import { NAVIGATION_ROUTES, UI_COPY } from "../../../core/constants/app.constants";
import type { RootStackParamList } from "../../../app/navigation/navigation-types";
import { AppButton, AppCard, AppChip, AppProgress, AppText, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import { useEnrollRoadmap } from "../use-roadmaps";
import {
  useEnrollmentDetail,
  useRoadmapDetail,
} from "../../learning/use-learning-detail";
import type { EnrolledRoadmapStep } from "../../learning/types";
import type { RoadmapStepSummary } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, typeof NAVIGATION_ROUTES.root.roadmapDetail>;

export function RoadmapDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<DetailRoute>();
  const { roadmapId, enrollmentId } = route.params;
  const { colors, spacing } = useTheme();
  const publicQuery = useRoadmapDetail(roadmapId, enrollmentId === undefined);
  const enrollmentQuery = useEnrollmentDetail(enrollmentId);
  const enrollMutation = useEnrollRoadmap();

  const roadmap = enrollmentId !== undefined
    ? enrollmentQuery.data?.roadmap
    : publicQuery.data;
  const milestones = roadmap?.milestones ?? [];
  const totalSteps = milestones.reduce((total, item) => total + item.steps.length, 0);
  const isLoading = enrollmentId !== undefined
    ? enrollmentQuery.isLoading
    : publicQuery.isLoading;
  const error = enrollmentId !== undefined
    ? enrollmentQuery.error
    : publicQuery.error;

  const styles = StyleSheet.create({
    content: { flex: 1, padding: spacing[24], gap: spacing[16] },
    header: { gap: spacing[8] },
    stats: { flexDirection: "row", flexWrap: "wrap", gap: spacing[8] },
    milestone: { gap: spacing[12] },
    step: { gap: spacing[8], padding: spacing[12], borderRadius: 8, backgroundColor: colors.surfaceVariant },
    stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[8] },
    message: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing[12] },
    list: { gap: spacing[12], paddingBottom: spacing[32] },
  });

  const openStep = (step: EnrolledRoadmapStep | RoadmapStepSummary) => {
    if (enrollmentId === undefined) return;
    const progress = "progress" in step ? step.progress : null;
    navigation.navigate(NAVIGATION_ROUTES.root.stepContent, {
      enrollmentId,
      stepId: step.id,
      stepTitle: step.title,
      progressStatus: progress?.status ?? "not_started",
      progressPercent: progress?.progressPercent ?? 0,
    });
  };

  return (
    <Screen>
      <View style={styles.content}>
        <AppButton variant="ghost" onPress={() => navigation.goBack()} accessibilityLabel={UI_COPY.common.back}>
          {UI_COPY.learning.back}
        </AppButton>
        {isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">{UI_COPY.learning.loadingRoadmap}</AppText>
          </View>
        ) : error || !roadmap ? (
          <View style={styles.message}>
            <AppText variant="titleMedium">{UI_COPY.learning.roadmapStatus}</AppText>
            <AppText color="textSecondary">
              {error instanceof Error ? error.message : UI_COPY.learning.roadmapUnavailable}
            </AppText>
            <AppButton variant="outline" onPress={() => void (enrollmentId !== undefined ? enrollmentQuery.refetch() : publicQuery.refetch())}>
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <AppText variant="headlineSmall">{roadmap.title}</AppText>
              {roadmap.description ? (
                <AppText color="textSecondary">{roadmap.description}</AppText>
              ) : null}
              <View style={styles.stats}>
                <AppChip label={roadmap.language.toUpperCase()} size="small" />
                <AppChip label={String(totalSteps) + " " + UI_COPY.roadmaps.stepsSuffix} size="small" />
                {"totalHours" in roadmap ? (
                  <AppChip label={String(roadmap.totalHours) + " " + UI_COPY.roadmaps.hoursSuffix} size="small" />
                ) : null}
              </View>
              {roadmap.skillAreas.length > 0 ? (
                <View style={styles.stats}>
                  {roadmap.skillAreas.map((skill) => (
                    <AppChip key={skill} label={skill} size="small" />
                  ))}
                </View>
              ) : null}
            </View>

            {enrollmentId === undefined ? (
              <AppButton
                loading={enrollMutation.isPending}
                disabled={enrollMutation.isPending}
                onPress={() => enrollMutation.mutate(roadmapId, {
                  onSuccess: (result) => navigation.replace(NAVIGATION_ROUTES.root.roadmapDetail, {
                    roadmapId,
                    enrollmentId: result.enrollmentId,
                  }),
                })}
              >
                {UI_COPY.roadmaps.enrollInRoadmap}
              </AppButton>
            ) : null}
            {enrollMutation.isError ? (
              <AppText color="error">
                {enrollMutation.error instanceof Error ? enrollMutation.error.message : UI_COPY.learning.enrollFailed}
              </AppText>
            ) : null}

            <FlatList
              style={{ flex: 1 }}
              data={milestones}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item: milestone }) => (
                <AppCard variant="outlined" style={styles.milestone}>
                  <View>
                    <AppText variant="titleMedium">
                      {String(milestone.sequence) + UI_COPY.learning.stepNumberSeparator + milestone.title}
                    </AppText>
                    {milestone.description ? (
                      <AppText color="textSecondary">{milestone.description}</AppText>
                    ) : null}
                  </View>
                  {milestone.steps.map((step) => {
                    const progress = "progress" in step ? step.progress : null;
                    const canOpen = enrollmentId !== undefined && step.contentStatus === "ready";
                    return (
                      <View key={step.id} style={styles.step}>
                        <View style={styles.stepRow}>
                          <View style={{ flex: 1, gap: spacing[4] }}>
                            <AppText variant="titleSmall">{String(step.sequence) + UI_COPY.learning.stepNumberSeparator + step.title}</AppText>
                            {step.description ? (
                              <AppText color="textSecondary">{step.description}</AppText>
                            ) : null}
                          </View>
                          <AppChip
                            label={progress?.status === "completed" ? UI_COPY.learning.statusCompleted : step.contentStatus === "ready" ? UI_COPY.learning.statusReady : UI_COPY.learning.statusPending}
                            size="small"
                          />
                        </View>
                        <AppText color="textSecondary" variant="labelSmall">
                          {step.estimatedMinutes + " " + UI_COPY.learning.minutesSuffix}
                        </AppText>
                        {progress ? (
                          <AppProgress
                            progress={progress.progressPercent / 100}
                            accessibilityRole="progressbar"
                            accessibilityValue={{ min: 0, max: 100, now: progress.progressPercent }}
                          />
                        ) : null}
                        {enrollmentId !== undefined ? (
                          <AppButton
                            size="small"
                            variant="outline"
                            disabled={!canOpen}
                            onPress={() => openStep(step)}
                          >
                            {progress?.status === "completed" ? UI_COPY.learning.reviewStep : UI_COPY.learning.openStep}
                          </AppButton>
                        ) : null}
                      </View>
                    );
                  })}
                </AppCard>
              )}
              ListEmptyComponent={
                <AppText color="textSecondary">{UI_COPY.learning.noSteps}</AppText>
              }
            />
          </>
        )}
      </View>
    </Screen>
  );
}
