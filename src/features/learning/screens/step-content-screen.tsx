import { useState } from "react";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Markdown, { type MarkdownProps } from "react-native-markdown-display";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  NAVIGATION_ROUTES,
  UI_COPY,
} from "../../../core/constants/app.constants";
import type { RootStackParamList } from "../../../app/navigation/navigation-types";
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
import type { EnrolledRoadmapStep } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type StepRoute = RouteProp<
  RootStackParamList,
  typeof NAVIGATION_ROUTES.root.stepContent
>;

const YOUTUBE_URL_PATTERN =
  /^https:\/\/(?:(?:www|m)\.)?youtube\.com\/|^https:\/\/youtu\.be\//i;

export function StepContentScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<StepRoute>();
  const {
    enrollmentId,
    stepId,
    stepTitle,
    progressStatus,
    progressPercent,
  } = route.params;
  const { colors, spacing, typography } = useTheme();
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

  const markdownStyles: NonNullable<MarkdownProps["style"]> = {
    body: {
      color: colors.text,
      fontSize: typography.bodyMedium.fontSize,
      lineHeight: typography.bodyMedium.lineHeight,
    },
    heading1: { color: colors.text, fontSize: typography.headlineSmall.fontSize },
    heading2: { color: colors.text, fontSize: typography.titleLarge.fontSize },
    heading3: { color: colors.text, fontSize: typography.titleMedium.fontSize },
    paragraph: { marginTop: 0, marginBottom: spacing[12] },
    code_inline: { backgroundColor: colors.surfaceVariant, color: colors.text },
    code_block: {
      backgroundColor: colors.surfaceVariant,
      color: colors.text,
      padding: spacing[12],
    },
    blockquote: {
      backgroundColor: colors.surfaceVariant,
      borderLeftColor: colors.primary,
    },
    link: { color: colors.primary },
  };

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

  const openVideo = async (url: string) => {
    try {
      if (!YOUTUBE_URL_PATTERN.test(url)) return;
      await Linking.openURL(url);
    } catch {
      // Invalid or unsupported URLs are not opened.
    }
  };

  const navigateToStep = (step: EnrolledRoadmapStep) => {
    navigation.replace(NAVIGATION_ROUTES.root.stepContent, {
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
        <AppButton variant="ghost" onPress={() => navigation.goBack()}>
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
            {contentQuery.data?.video ? (
              <AppCard variant="outlined" style={styles.section}>
                <AppText variant="titleMedium">
                  {UI_COPY.learning.videoLesson}
                </AppText>
                <AppText color="textSecondary">
                  {contentQuery.data.video.provider.toUpperCase() +
                    " " +
                    UI_COPY.learning.videoSuffix}
                </AppText>
                <AppButton
                  onPress={() =>
                    void openVideo(contentQuery.data?.video?.url ?? "")
                  }
                >
                  {UI_COPY.learning.openVideo}
                </AppButton>
              </AppCard>
            ) : null}

            {contentQuery.data?.contentMarkdown ? (
              <AppCard variant="outlined">
                <Markdown style={markdownStyles}>
                  {contentQuery.data.contentMarkdown}
                </Markdown>
              </AppCard>
            ) : null}

            {!contentQuery.data?.video &&
            !contentQuery.data?.contentMarkdown ? (
              <AppText color="textSecondary">
                {UI_COPY.learning.noPublishedContent}
              </AppText>
            ) : null}

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
