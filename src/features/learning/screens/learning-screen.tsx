import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import type { RootStackParamList } from "../../../app/navigation/navigation-types";
import { NAVIGATION_ROUTES, UI_COPY } from "../../../core/constants/app.constants";
import {
  AppButton,
  AppCard,
  AppProgress,
  AppText,
  Screen,
} from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import { useLearningEnrollments } from "../use-learning";
import type { LearningEnrollment } from "../types";

function formatDate(value: string | null): string {
  if (!value) return UI_COPY.learning.notStarted;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return UI_COPY.learning.dateUnavailable;
  return date.toLocaleDateString();
}

function statusLabel(status: string): string {
  const normalizedStatus = status.toLowerCase();
  const labels = UI_COPY.learning.statusLabels;
  return labels[normalizedStatus as keyof typeof labels] ?? labels.unknown;
}

export function LearningScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, spacing } = useTheme();
  const enrollmentsQuery = useLearningEnrollments();
  const enrollments =
    enrollmentsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const styles = StyleSheet.create({
    content: { flex: 1, gap: spacing[16] },
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
      <AppProgress
        progress={item.progressPercent / 100}
        accessibilityRole="progressbar"
        accessibilityLabel={item.title + " " + UI_COPY.learning.progressAccessibilitySuffix}
        accessibilityValue={{ min: 0, max: 100, now: item.progressPercent }}
      />
      <AppText color="textSecondary" variant="labelSmall">
        {UI_COPY.learning.lastActivityPrefix} {formatDate(item.lastActivityAt)}
      </AppText>
      <AppButton
        variant="outline"
        onPress={() =>
          navigation.navigate(NAVIGATION_ROUTES.root.roadmapDetail, {
            roadmapId: item.roadmapId,
            enrollmentId: item.enrollmentId,
          })
        }
      >
        {UI_COPY.learning.openRoadmap}
      </AppButton>
    </AppCard>
  );

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.heading}>
          <AppText variant="headlineSmall">{UI_COPY.learning.myLearningTitle}</AppText>
          <AppText color="textSecondary">
            {UI_COPY.learning.myLearningDescription}
          </AppText>
        </View>

        {enrollmentsQuery.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">
              {UI_COPY.learning.loadingEnrollments}
            </AppText>
          </View>
        ) : enrollmentsQuery.isError ? (
          <View style={styles.error}>
            <AppText variant="titleMedium">
              {UI_COPY.learning.dataUnavailable}
            </AppText>
            <AppText color="textSecondary">
              {enrollmentsQuery.error instanceof Error
                ? enrollmentsQuery.error.message
                : UI_COPY.learning.dataUnavailable}
            </AppText>
            <AppButton
              variant="outline"
              onPress={() => void enrollmentsQuery.refetch()}
            >
              {UI_COPY.common.retry}
            </AppButton>
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
            ListEmptyComponent={() => (
              <AppText color="textSecondary" style={styles.message}>
                {UI_COPY.learning.emptyEnrollments}
              </AppText>
            )}
            ListFooterComponent={
              enrollmentsQuery.hasNextPage ? (
                <View style={styles.footer}>
                  <AppButton
                    variant="outline"
                    loading={enrollmentsQuery.isFetchingNextPage}
                    disabled={enrollmentsQuery.isFetchingNextPage}
                    onPress={() => void enrollmentsQuery.fetchNextPage()}
                  >
                    {enrollmentsQuery.isFetchingNextPage
                      ? UI_COPY.common.loading
                      : UI_COPY.common.loadMore}
                  </AppButton>
                </View>
              ) : undefined
            }
          />
        )}
      </View>
    </Screen>
  );
}
