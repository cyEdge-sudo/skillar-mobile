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

import { UI_COPY } from "../../../core/constants/app.constants";
import type { RootStackParamList } from "../../../app/navigation/navigation-types";
import { AppButton, AppCard, AppText, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import {
  useStepAssessment,
  useStepContent,
  useUpdateStepProgress,
} from "../use-learning-detail";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type StepRoute = RouteProp<RootStackParamList, "StepContent">;

const YOUTUBE_URL_PATTERN = /^https:\/\/(?:(?:www|m)\\.)?youtube\\.com\\/|^https:\/\/youtu\\.be\\//i;

export function StepContentScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<StepRoute>();
  const { enrollmentId, stepId, stepTitle, progressStatus } = route.params;
  const { colors, spacing, typography } = useTheme();
  const contentQuery = useStepContent(stepId);
  const [showAssessment, setShowAssessment] = useState(false);
  const assessmentQuery = useStepAssessment(stepId, showAssessment);
  const progressMutation = useUpdateStepProgress();

  const markdownStyles: NonNullable<MarkdownProps["style"]> = {
    body: { color: colors.text, fontSize: typography.bodyMedium.fontSize, lineHeight: typography.bodyMedium.lineHeight },
    heading1: { color: colors.text, fontSize: typography.headlineSmall.fontSize },
    heading2: { color: colors.text, fontSize: typography.titleLarge.fontSize },
    heading3: { color: colors.text, fontSize: typography.titleMedium.fontSize },
    paragraph: { marginTop: 0, marginBottom: spacing[12] },
    code_inline: { backgroundColor: colors.surfaceVariant, color: colors.text },
    code_block: { backgroundColor: colors.surfaceVariant, color: colors.text, padding: spacing[12] },
    blockquote: { backgroundColor: colors.surfaceVariant, borderLeftColor: colors.primary },
    link: { color: colors.primary },
  };

  const styles = StyleSheet.create({
    content: { flex: 1, padding: spacing[24], gap: spacing[16] },
    header: { gap: spacing[8] },
    section: { gap: spacing[12] },
    message: { alignItems: "center", justifyContent: "center", gap: spacing[12], paddingVertical: spacing[24] },
    question: { gap: spacing[8], padding: spacing[12], backgroundColor: colors.surfaceVariant, borderRadius: 8 },
  });

  const openVideo = async (url: string) => {
    try {
      if (!YOUTUBE_URL_PATTERN.test(url)) return;
      await Linking.openURL(url);
    } catch {
      // Invalid or unsupported URLs are not opened.
    }
  };

  const isCompleted = progressStatus === "completed" || progressMutation.isSuccess;

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
          Back to roadmap
        </AppButton>
        <View style={styles.header}>
          <AppText variant="headlineSmall">{contentQuery.data?.title ?? stepTitle}</AppText>
          <AppText color="textSecondary">Step learning content</AppText>
        </View>

        {contentQuery.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">Loading step content…</AppText>
          </View>
        ) : contentQuery.isError ? (
          <View style={styles.message}>
            <AppText variant="titleMedium">Step content unavailable</AppText>
            <AppText color="textSecondary">
              {contentQuery.error instanceof Error ? contentQuery.error.message : UI_COPY.learning.contentUnavailable}
            </AppText>
            <AppButton variant="outline" onPress={() => void contentQuery.refetch()}>
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ gap: spacing[16], paddingBottom: spacing[32] }}>
            {contentQuery.data?.video ? (
              <AppCard variant="outlined" style={styles.section}>
                <AppText variant="titleMedium">Video lesson</AppText>
                <AppText color="textSecondary">
                  {contentQuery.data.video.provider.toUpperCase() + " video"}
                </AppText>
                <AppButton onPress={() => void openVideo(contentQuery.data?.video?.url ?? "")}>
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

            {!contentQuery.data?.video && !contentQuery.data?.contentMarkdown ? (
              <AppText color="textSecondary">{UI_COPY.learning.pendingContent}</AppText>
            ) : null}

            <AppCard variant="outlined" style={styles.section}>
              <AppText variant="titleMedium">{UI_COPY.learning.assessmentTitle}</AppText>
              <AppText color="textSecondary">{UI_COPY.learning.readOnlyAssessment}</AppText>
              <AppButton
                variant="outline"
                onPress={() => setShowAssessment((current) => !current)}
              >
                {showAssessment ? "Hide questions" : "View questions"}
              </AppButton>
              {showAssessment ? (
                assessmentQuery.isLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : assessmentQuery.isError ? (
                  <AppText color="textSecondary">{UI_COPY.learning.assessmentUnavailable}</AppText>
                ) : assessmentQuery.data && assessmentQuery.data.items.length > 0 ? (
                  assessmentQuery.data.items.map((question, index) => (
                    <View key={question.questionId} style={styles.question}>
                      <AppText variant="titleSmall">
                        {String(index + 1) + ". " + question.question}
                      </AppText>
                      <AppText color="textSecondary" variant="labelSmall">
                        {question.type.replace(/_/g, " ")}
                      </AppText>
                      {question.options?.map((option) => (
                        <AppText key={option.optionId}>{option.optionId + ". " + option.text}</AppText>
                      ))}
                    </View>
                  ))
                ) : (
                  <AppText color="textSecondary">{UI_COPY.learning.assessmentUnavailable}</AppText>
                )
              ) : null}
            </AppCard>
          </ScrollView>
        )}

        {!isCompleted ? (
          <View style={{ gap: spacing[8] }}>
            <AppButton
              loading={progressMutation.isPending}
              disabled={progressMutation.isPending || contentQuery.isLoading || contentQuery.isError}
              onPress={markCompleted}
            >
              {UI_COPY.learning.markComplete}
            </AppButton>
            {progressMutation.isError ? (
              <AppText color="error">
                {progressMutation.error instanceof Error ? progressMutation.error.message : "Progress could not be saved."}
              </AppText>
            ) : null}
          </View>
        ) : (
          <AppText color="success">{UI_COPY.learning.completed}</AppText>
        )}
      </View>
    </Screen>
  );
}
