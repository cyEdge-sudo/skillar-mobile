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

import type { RootStackParamList } from "../../../app/navigation/navigation-types";
import {
  NAVIGATION_ROUTES,
  UI_COPY,
} from "../../../core/constants/app.constants";
import {
  AppButton,
  AppCard,
  AppChip,
  AppText,
  Screen,
} from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import { useCompleteJourneyActivity, useJourneyDetail } from "../use-journeys";
import type { JourneyActivity } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type JourneyRoute = RouteProp<
  RootStackParamList,
  typeof NAVIGATION_ROUTES.root.journeyDetail
>;

function activityLabel(type: string): string {
  switch (type) {
    case "TASK":
      return UI_COPY.journeys.task;
    case "VIDEO":
      return UI_COPY.journeys.video;
    case "DOCUMENT":
      return UI_COPY.journeys.document;
    case "ACKNOWLEDGEMENT":
      return UI_COPY.journeys.acknowledgement;
    case "ASSESSMENT":
      return UI_COPY.journeys.assessment;
    case "ROADMAP":
      return UI_COPY.journeys.roadmap;
    case "SCORM":
      return UI_COPY.journeys.scorm;
    default:
      return UI_COPY.journeys.unsupportedActivity;
  }
}

function isCompleted(status: string): boolean {
  return (
    status === "COMPLETED" ||
    status === "SKIPPED_PASSED" ||
    status === "SKIPPED_CONDITION"
  );
}

function activityStatusLabel(status: string): string {
  if (isCompleted(status)) return UI_COPY.journeys.completed;
  if (status === "PENDING" || status === "NOT_STARTED") {
    return UI_COPY.journeys.pending;
  }
  if (status === "IN_PROGRESS") return UI_COPY.journeys.inProgress;
  return UI_COPY.journeys.unknownStatus;
}

function isSupportedVideoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (host === "youtube.com" ||
        host === "www.youtube.com" ||
        host === "m.youtube.com" ||
        host === "youtu.be")
    );
  } catch {
    return false;
  }
}

export function JourneyDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<JourneyRoute>();
  const { enrollmentId } = route.params;
  const { colors, spacing, typography } = useTheme();
  const query = useJourneyDetail(enrollmentId);
  const completionMutation = useCompleteJourneyActivity(enrollmentId);

  const styles = StyleSheet.create({
    content: { flex: 1, gap: spacing[16] },
    heading: { gap: spacing[8] },
    metadata: { flexDirection: "row", flexWrap: "wrap", gap: spacing[8] },
    stage: { gap: spacing[12] },
    stageHeading: { gap: spacing[4] },
    activity: {
      gap: spacing[8],
      padding: spacing[12],
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
    activityHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing[8],
    },
    message: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing[12],
    },
    question: { gap: spacing[4], paddingVertical: spacing[4] },
  });

  const markdownStyles: NonNullable<MarkdownProps["style"]> = {
    body: {
      color: colors.text,
      fontSize: typography.bodyMedium.fontSize,
      lineHeight: typography.bodyMedium.lineHeight,
    },
    heading1: {
      color: colors.text,
      fontSize: typography.headlineSmall.fontSize,
    },
    heading2: {
      color: colors.text,
      fontSize: typography.titleLarge.fontSize,
    },
    heading3: {
      color: colors.text,
      fontSize: typography.titleMedium.fontSize,
    },
    paragraph: { marginTop: 0, marginBottom: spacing[12] },
    code_inline: {
      backgroundColor: colors.surfaceVariant,
      color: colors.text,
    },
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

  const openVideo = async (url: string) => {
    if (!isSupportedVideoUrl(url)) return;
    try {
      await Linking.openURL(url);
    } catch {
      // The device may not have a handler for the URL.
    }
  };

  const renderActivityContent = (activity: JourneyActivity) => {
    switch (activity.type) {
      case "TASK": {
        const taskBody = activity.metadata.taskBody;
        if (taskBody) {
          return <Markdown style={markdownStyles}>{taskBody}</Markdown>;
        }
        return activity.description ? (
          <AppText color="textSecondary">{activity.description}</AppText>
        ) : null;
      }
      case "VIDEO":
        if (!activity.metadata.contentUrl) {
          return activity.description ? (
            <AppText color="textSecondary">{activity.description}</AppText>
          ) : (
            <AppText color="textSecondary">
              {UI_COPY.journeys.unsupportedVideoUrl}
            </AppText>
          );
        }
        return isSupportedVideoUrl(activity.metadata.contentUrl) ? (
          <AppButton
            size="small"
            variant="outline"
            onPress={() => void openVideo(activity.metadata.contentUrl ?? "")}
          >
            {UI_COPY.journeys.openVideo}
          </AppButton>
        ) : (
          <AppText color="textSecondary">
            {UI_COPY.journeys.unsupportedVideoUrl}
          </AppText>
        );
      case "DOCUMENT":
        return (
          <AppText color="textSecondary">
            {UI_COPY.journeys.documentUnavailable}
          </AppText>
        );
      case "ROADMAP":
        return activity.metadata.roadmapId ? (
          <View style={{ gap: spacing[8] }}>
            <AppText color="textSecondary">
              {UI_COPY.journeys.roadmapCompletion}
            </AppText>
            <AppButton
              size="small"
              variant="outline"
              onPress={() =>
                navigation.navigate(NAVIGATION_ROUTES.root.roadmapDetail, {
                  roadmapId: activity.metadata.roadmapId ?? "",
                })
              }
            >
              {UI_COPY.roadmaps.viewDetails}
            </AppButton>
          </View>
        ) : (
          <AppText color="textSecondary">
            {UI_COPY.journeys.roadmapCompletion}
          </AppText>
        );
      case "ASSESSMENT":
        return (
          <View style={{ gap: spacing[8] }}>
            <AppText color="textSecondary">
              {UI_COPY.journeys.assessmentReadOnly}
            </AppText>
            {activity.metadata.questions &&
            activity.metadata.questions.length > 0 ? (
              activity.metadata.questions.map((question, index) => (
                <View key={question.questionId} style={styles.question}>
                  <AppText variant="titleSmall">
                    {String(index + 1) + ". " + question.question}
                  </AppText>
                  <AppText color="textSecondary" variant="labelSmall">
                    {question.type.replace(/_/g, " ")}
                  </AppText>
                  {question.options.map((option) => (
                    <AppText key={option.optionId} color="textSecondary">
                      {option.optionId + ". " + option.text}
                    </AppText>
                  ))}
                </View>
              ))
            ) : (
              <AppText color="textSecondary">
                {UI_COPY.journeys.assessmentNoQuestions}
              </AppText>
            )}
          </View>
        );
      case "ACKNOWLEDGEMENT":
        return (
          <AppText color="textSecondary">
            {activity.metadata.acknowledgementText ||
              activity.description ||
              ""}
          </AppText>
        );
      case "SCORM":
        return (
          <AppText color="textSecondary">
            {UI_COPY.journeys.scormUnsupported}
          </AppText>
        );
      default:
        return (
          <AppText color="textSecondary">
            {activity.description || UI_COPY.journeys.unsupportedActivity}
          </AppText>
        );
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <AppButton variant="ghost" onPress={() => navigation.goBack()}>
          {UI_COPY.common.back}
        </AppButton>

        {query.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">
              {UI_COPY.journeys.loading}
            </AppText>
          </View>
        ) : query.isError && !query.data ? (
          <View style={styles.message}>
            <AppText variant="titleMedium">
              {UI_COPY.journeys.unavailable}
            </AppText>
            <AppText color="textSecondary">
              {query.error instanceof Error
                ? query.error.message
                : UI_COPY.journeys.unavailable}
            </AppText>
            <AppButton
              variant="outline"
              onPress={() => void query.refetch()}
            >
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : query.data ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: spacing[16],
              paddingBottom: spacing[32],
            }}
          >
            {query.isError ? (
              <AppText color="error">
                {UI_COPY.journeys.refreshFailed}
              </AppText>
            ) : null}

            <View style={styles.heading}>
              <AppText variant="headlineSmall">
                {query.data.journey.title}
              </AppText>
              {query.data.journey.description ? (
                <AppText color="textSecondary">
                  {query.data.journey.description}
                </AppText>
              ) : null}
              <View style={styles.metadata}>
                <AppChip
                  label={query.data.journey.type.replace(/_/g, " ")}
                  size="small"
                />
                <AppChip
                  label={query.data.progress.percent + "%"}
                  size="small"
                />
                <AppChip
                  label={
                    query.data.progress.completedStages +
                    " / " +
                    query.data.progress.totalStages +
                    " " +
                    UI_COPY.journeys.stage.toLowerCase()
                  }
                  size="small"
                />
              </View>
            </View>

            {query.data.journey.stages.length === 0 ? (
              <AppText color="textSecondary">
                {UI_COPY.journeys.noStages}
              </AppText>
            ) : null}

            {query.data.journey.stages.map((stage) => (
              <AppCard key={stage.id} variant="outlined" style={styles.stage}>
                <View style={styles.stageHeading}>
                  <View style={styles.activityHeading}>
                    <AppText variant="titleMedium">
                      {String(stage.position) + ". " + stage.title}
                    </AppText>
                    <AppChip
                      label={
                        stage.progress.isCompleted
                          ? UI_COPY.journeys.completed
                          : stage.progress.isUnlocked
                            ? UI_COPY.journeys.inProgress
                            : UI_COPY.journeys.locked
                      }
                      size="small"
                    />
                  </View>
                  {stage.description ? (
                    <AppText color="textSecondary">
                      {stage.description}
                    </AppText>
                  ) : null}
                </View>

                {!stage.progress.isUnlocked ? (
                  <AppText color="textSecondary">
                    {UI_COPY.journeys.locked}
                  </AppText>
                ) : stage.activities.length === 0 ? (
                  <AppText color="textSecondary">
                    {UI_COPY.journeys.noActivities}
                  </AppText>
                ) : (
                  stage.activities.map((activity) => {
                    const done = isCompleted(activity.progress.status);
                    const canComplete =
                      stage.progress.isUnlocked &&
                      !done &&
                      ["TASK", "VIDEO", "ACKNOWLEDGEMENT"].includes(
                        activity.type,
                      );

                    return (
                      <View key={activity.id} style={styles.activity}>
                        <View style={styles.activityHeading}>
                          <View style={{ flex: 1, gap: spacing[4] }}>
                            <AppText variant="titleSmall">
                              {activity.title}
                            </AppText>
                            <AppText color="textSecondary" variant="labelSmall">
                              {activityLabel(activity.type)}
                              {activity.isRequired ? " · Required" : ""}
                            </AppText>
                          </View>
                          <AppChip
                            label={activityStatusLabel(activity.progress.status)}
                            size="small"
                          />
                        </View>

                        {activity.description &&
                        activity.type !== "TASK" ? (
                          <AppText color="textSecondary">
                            {activity.description}
                          </AppText>
                        ) : null}

                        {renderActivityContent(activity)}

                        {canComplete ? (
                          <AppButton
                            size="small"
                            loading={
                              completionMutation.isPending &&
                              completionMutation.variables === activity.id
                            }
                            disabled={completionMutation.isPending}
                            onPress={() =>
                              completionMutation.mutate(activity.id)
                            }
                          >
                            {UI_COPY.journeys.completeActivity}
                          </AppButton>
                        ) : null}
                      </View>
                    );
                  })
                )}
              </AppCard>
            ))}

            {completionMutation.isError ? (
              <AppText color="error">
                {completionMutation.error instanceof Error
                  ? completionMutation.error.message
                  : UI_COPY.journeys.completionFailed}
              </AppText>
            ) : null}
          </ScrollView>
        ) : null}
      </View>
    </Screen>
  );
}
