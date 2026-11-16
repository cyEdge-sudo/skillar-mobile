import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import {
  AppCard,
  AppProgress,
  AppText,
  Screen,
} from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import { useLearningEnrollments } from "../use-learning";
import type { LearningEnrollment } from "../types";

function formatDate(value: string | null): string {
  if (!value) return "Not started";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString();
}

function statusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "enrolled":
      return "In progress";
    case "assigned":
      return "Assigned";
    case "completed":
      return "Completed";
    case "paused":
      return "Paused";
    case "dropped":
      return "Dropped";
    default:
      return "Unknown status";
  }
}

export function LearningScreen() {
  const { colors, spacing } = useTheme();
  const enrollmentsQuery = useLearningEnrollments();
  const enrollments =
    enrollmentsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, padding: spacing[24], gap: spacing[16] },
    heading: { gap: spacing[4] },
    list: { gap: spacing[12], paddingBottom: spacing[32] },
    card: { gap: spacing[12] },
    metadata: { flexDirection: "row", justifyContent: "space-between" },
    message: { textAlign: "center", paddingVertical: spacing[24] },
    error: { alignItems: "center", gap: spacing[12], paddingVertical: spacing[24] },
    footer: { alignItems: "center", paddingVertical: spacing[16] },
  });

  const renderEnrollment = ({ item }: { item: LearningEnrollment }) => (
    <AppCard variant="outlined" style={styles.card}>
      <AppText variant="titleMedium">{item.title}</AppText>
      <View style={styles.metadata}>
        <AppText color="textSecondary" variant="labelMedium">
          {statusLabel(item.status)}
        </AppText>
        <AppText color="textSecondary" variant="labelMedium">
          {item.progressPercent}%
        </AppText>
      </View>
      <AppProgress progress={item.progressPercent / 100} />
      <AppText color="textSecondary" variant="labelSmall">
        Last activity: {formatDate(item.lastActivityAt)}
      </AppText>
    </AppCard>
  );

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.heading}>
          <AppText variant="headlineSmall">My learning</AppText>
          <AppText color="textSecondary">
            Track your enrolled roadmaps and learning progress.
          </AppText>
        </View>

        {enrollmentsQuery.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">Loading your learning…</AppText>
          </View>
        ) : enrollmentsQuery.isError ? (
          <View style={styles.error}>
            <AppText variant="titleMedium">Learning data is unavailable</AppText>
            <AppText color="textSecondary">
              {enrollmentsQuery.error instanceof Error
                ? enrollmentsQuery.error.message
                : "Try again in a moment."}
            </AppText>
            <AppText
              color="primary"
              onPress={() => void enrollmentsQuery.refetch()}
              accessibilityRole="button"
            >
              Retry
            </AppText>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={enrollments}
            renderItem={renderEnrollment}
            keyExtractor={(item) => String(item.enrollmentId)}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing[12] }} />}
            refreshing={enrollmentsQuery.isRefetching}
            onRefresh={() => void enrollmentsQuery.refetch()}
            ListEmptyComponent={
              <AppText color="textSecondary" style={styles.message}>
                You have not enrolled in any roadmaps yet. Explore roadmaps to get started.
              </AppText>
            }
            ListFooterComponent={
              enrollmentsQuery.hasNextPage ? (
                <View style={styles.footer}>
                  <AppText
                    color="primary"
                    onPress={() => void enrollmentsQuery.fetchNextPage()}
                    accessibilityRole="button"
                  >
                    {enrollmentsQuery.isFetchingNextPage ? "Loading…" : "Load more"}
                  </AppText>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </Screen>
  );
}
