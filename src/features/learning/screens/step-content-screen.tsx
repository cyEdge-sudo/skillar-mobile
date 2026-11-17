import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { UI_COPY } from "../../../core/constants/app.constants";
import {
  AppButton,
  AppCard,
  AppProgress,
  AppText,
  Screen,
} from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import {
  useEnrollmentDetail,
  usePrefetchStepContent,
  useStepAssessment,
  useStepContent,
  useUpdateStepProgress,
} from "../use-learning-detail";
import { StepContentRenderer } from "../components/step-content-renderer";
import type { EnrolledRoadmapStep, StepContentRouteParams } from "../types";

export interface StepContentScreenProps {
  routeParams: StepContentRouteParams;
  onGoBack: () => void;
  onReplaceStep: (params: StepContentRouteParams) => void;
}

export function StepContentScreen({ routeParams, onGoBack, onReplaceStep }: StepContentScreenProps) {
  const {
    enrollmentId,
    stepId,
    stepTitle,
    progressStatus,
    progressPercent,
  } = routeParams;
  const { colors, spacing } = useTheme();
  const enrollmentQuery = useEnrollmentDetail(enrollmentId);
  const contentQuery = useStepContent(stepId);
  const [showAssessment, setShowAssessment] = useState(false);
  const assessmentQuery = useStepAssessment(stepId, showAssessment);
  const progressMutation = useUpdateStepProgress();

  const navigableSteps: EnrolledRoadmapStep[] =
    enrollmentQuery.data?.roadmap.milestones
      .slice()
      .sort((left, right) => left.sequence - right.sequence)
      .flatMap((milestone) =>
        milestone.steps
          .slice()
          .sort((left, right) => left.sequence - right.sequence)
          .filter((step) => step.contentStatus === "ready"),
      ) ?? [];

  const currentStepIndex = navigableSteps.findIndex((step) => step.id === stepId);
  const previousStep =
    currentStepIndex > 0 ? navigableSteps[currentStepIndex - 1] : undefined;
  const nextStep =
    currentStepIndex >= 0 && currentStepIndex < navigableSteps.length - 1
      ? navigableSteps[currentStepIndex + 1]
      : undefined;

  usePrefetchStepContent(nextStep?.id);

  const currentStep =
    currentStepIndex >= 0 ? navigableSteps[currentStepIndex] : undefined;
  const mutationAppliesToCurrentStep =
    progressMutation.variables?.stepId === stepId;
  const isCompleted =
    progressStatus === "completed" ||
    (mutationAppliesToCurrentStep && progressMutation.isSuccess);
  const currentProgress =
    mutationAppliesToCurrentStep && progressMutation.isSuccess
      ? progressMutation.data?.progressPercent ?? 100
      : currentStep?.progress?.progressPercent ?? progressPercent;

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      padding: spacing[24],
      gap: spacing[16],
    },
    header: { gap: spacing[8] },
    section: { gap: spacing[12] },
    message: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[12],
      paddingVertical: spacing[24],
    },
    question: {
      gap: spacing[8],
      padding: spacing[12],
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
    navigation: {
      flexDirection: "row",
      gap: spacing[12],
    },
    navigationButton: { flex: 1 },
  });

  const navigateToStep = (step: EnrolledRoadmapStep) => {
    onReplaceStep({
      enrollmentId,
      stepId: step.id,
      stepTitle: step.title,
      progressStatus: step.progress?.status ?? "not_started",
      progressPercent: step.progress?.progressPercent ?? 0,
    });
  };

  const markCompleted = () => {
    progressMutation.mutate({
      enrollmentId,
      stepId,
      status: "completed",
      progressPercent: 100,
    });
  };

  return (
    <Screen>
      <View style={styles.content}>
        <AppButton variant="ghost" onPress={onGoBack}>
          {UI_COPY.learning.backToRoadmap}
        </AppButton>

        <View style={styles.header}>
          <AppText variant="headlineSmall">
            {contentQuery.data?.title ?? stepTitle}
          </AppText>
          {currentStepIndex >= 0 ? (
            <AppText color="textSecondary" variant="labelMedium">
              {UI_COPY.learning.stepPositionPrefix +
                " " +
                String(currentStepIndex + 1) +
                " " +
                UI_COPY.learning.stepPositionSeparator +
                " " +
                String(navigableSteps.length)}
            </AppText>
          ) : (
            <AppText color="textSecondary">
              {UI_COPY.learning.stepContentSubtitle}
            </AppText>
          )}
          <AppProgress
            progress={currentProgress / 100}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: currentProgress }}
          />
        </View>

        {contentQuery.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">{UI_COPY.learning.loadingStep}</AppText>
          </View>
        ) : contentQuery.isError ? (
          <View style={styles.message}>
            <AppText variant="titleMedium">
              {UI_COPY.learning.stepUnavailable}
            </AppText>
            <AppText color="textSecondary">
              {contentQuery.error instanceof Error
                ? contentQuery.error.message
                : UI_COPY.learning.contentUnavailable}
            </AppText>
            <AppButton
              variant="outline"
              onPress={() => void contentQuery.refetch()}
            >
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: spacing[16],
              paddingBottom: spacing[32],
            }}
          >
            <StepContentRenderer
              blocks={contentQuery.data?.contentBlocks ?? []}
              fallbackVideoUrl={contentQuery.data?.video?.url ?? null}
              fallbackMarkdown={contentQuery.data?.contentMarkdown ?? null}
            />

            <AppCard variant="outlined" style={styles.section}>
              <AppText variant="titleMedium">
                {UI_COPY.learning.assessmentTitle}
              </AppText>
              <AppText color="textSecondary">
                {UI_COPY.learning.readOnlyAssessment}
              </AppText>
              <AppButton
                variant="outline"
                onPress={() => setShowAssessment((current) => !current)}
              >
                {showAssessment
                  ? UI_COPY.learning.hideQuestions
                  : UI_COPY.learning.viewQuestions}
              </AppButton>
              {showAssessment ? (
                assessmentQuery.isLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : assessmentQuery.isError ? (
                  <AppText color="textSecondary">
                    {UI_COPY.learning.assessmentUnavailable}
                  </AppText>
                ) : assessmentQuery.data &&
                  assessmentQuery.data.items.length > 0 ? (
                  assessmentQuery.data.items.map((question, index) => (
                    <View key={question.questionId} style={styles.question}>
                      <AppText variant="titleSmall">
                        {String(index + 1) +
                          UI_COPY.learning.questionNumberSeparator +
                          question.question}
                      </AppText>
                      <AppText color="textSecondary" variant="labelSmall">
                        {question.type.replace(/_/g, " ")}
                      </AppText>
                      {question.options?.map((option) => (
                        <AppText key={option.optionId}>
                          {option.optionId +
                            UI_COPY.learning.optionNumberSeparator +
                            option.text}
                        </AppText>
                      ))}
                    </View>
                  ))
                ) : (
                  <AppText color="textSecondary">
                    {UI_COPY.learning.assessmentUnavailable}
                  </AppText>
                )
              ) : null}
            </AppCard>
          </ScrollView>
        )}

        {!isCompleted ? (
          <View style={{ gap: spacing[8] }}>
            <AppButton
              loading={
                progressMutation.isPending && mutationAppliesToCurrentStep
              }
              disabled={
                (progressMutation.isPending && mutationAppliesToCurrentStep) ||
                contentQuery.isLoading ||
                contentQuery.isError
              }
              onPress={markCompleted}
            >
              {UI_COPY.learning.markComplete}
            </AppButton>
            {progressMutation.isError && mutationAppliesToCurrentStep ? (
              <AppText color="error">
                {progressMutation.error instanceof Error
                  ? progressMutation.error.message
                  : UI_COPY.learning.progressSaveFailed}
              </AppText>
            ) : null}
          </View>
        ) : (
          <AppText color="success">{UI_COPY.learning.completed}</AppText>
        )}

        {currentStepIndex >= 0 ? (
          <View style={styles.navigation}>
            <AppButton
              variant="outline"
              style={styles.navigationButton}
              disabled={
                !previousStep ||
                (progressMutation.isPending && mutationAppliesToCurrentStep)
              }
              onPress={() => {
                if (previousStep) navigateToStep(previousStep);
              }}
            >
              {UI_COPY.learning.previousStep}
            </AppButton>
            <AppButton
              style={styles.navigationButton}
              disabled={
                !nextStep ||
                (progressMutation.isPending && mutationAppliesToCurrentStep)
              }
              onPress={() => {
                if (nextStep) navigateToStep(nextStep);
              }}
            >
              {UI_COPY.learning.nextStep}
            </AppButton>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
