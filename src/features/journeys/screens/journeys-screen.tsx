import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  FlatList,
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
  AppProgress,
  AppText,
  Screen,
} from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import type { JourneySummary } from "../types";
import { useJourneys } from "../use-journeys";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function journeyStatusLabel(status: string): string {
  switch (status) {
    case "COMPLETED":
      return UI_COPY.journeys.completed;
    case "IN_PROGRESS":
      return UI_COPY.journeys.inProgress;
    case "NOT_STARTED":
    case "PENDING":
      return UI_COPY.journeys.pending;
    case "OVERDUE":
      return UI_COPY.journeys.overdue;
    default:
      return UI_COPY.journeys.unknownStatus;
  }
}

export function JourneysScreen() {
  const navigation = useNavigation<Navigation>();
  const { colors, spacing } = useTheme();
  const query = useJourneys();
  const journeys = query.data?.pages.flatMap((page) => page.items) ?? [];

  const styles = StyleSheet.create({
    content: { flex: 1, gap: spacing[16] },
    heading: { gap: spacing[4] },
    list: { gap: spacing[12], paddingBottom: spacing[32] },
    card: { gap: spacing[12] },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing[8],
    },
    message: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[12],
      paddingVertical: spacing[24],
    },
    footer: { alignItems: "center", paddingVertical: spacing[16] },
  });

  const renderJourney = ({ item }: { item: JourneySummary }) => (
    <AppCard variant="outlined" style={styles.card}>
      <View style={styles.row}>
        <AppText color="textSecondary" variant="labelSmall">
          {item.journey.type.replace(/_/g, " ")}
        </AppText>
        <AppText color="textSecondary" variant="labelSmall">
          {journeyStatusLabel(item.status)}
        </AppText>
      </View>

      <AppText variant="titleMedium">{item.journey.title}</AppText>
      {item.journey.description ? (
        <AppText color="textSecondary">{item.journey.description}</AppText>
      ) : null}

      <View style={styles.row}>
        <AppText color="textSecondary" variant="labelSmall">
          {UI_COPY.journeys.progress}
        </AppText>
        <AppText color="textSecondary" variant="labelSmall">
          {item.progress.percent}%
        </AppText>
      </View>

      <AppProgress
        progress={item.progress.percent / 100}
        accessibilityRole="progressbar"
        accessibilityLabel={
          item.journey.title + " " + UI_COPY.journeys.progress
        }
        accessibilityValue={{
          min: 0,
          max: 100,
          now: item.progress.percent,
        }}
      />

      <AppText color="textSecondary" variant="labelSmall">
        {item.progress.completedActivities} / {item.progress.totalActivities}{" "}
        {UI_COPY.journeys.activity.toLowerCase()}
      </AppText>

      {item.nextActivity ? (
        <AppText color="textSecondary" variant="labelSmall">
          {UI_COPY.common.continue}: {item.nextActivity.title}
        </AppText>
      ) : null}

      <AppButton
        variant="outline"
        onPress={() =>
          navigation.navigate(NAVIGATION_ROUTES.root.journeyDetail, {
            enrollmentId: item.enrollmentId,
          })
        }
      >
        {UI_COPY.journeys.open}
      </AppButton>
    </AppCard>
  );

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.heading}>
          <AppText variant="headlineSmall">{UI_COPY.journeys.title}</AppText>
          <AppText color="textSecondary">
            {UI_COPY.journeys.description}
          </AppText>
        </View>

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
            <AppButton variant="outline" onPress={() => void query.refetch()}>
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : (
          <>
            {query.isError ? (
              <AppText color="error">
                {UI_COPY.journeys.refreshFailed}
              </AppText>
            ) : null}

            <FlatList
              style={{ flex: 1 }}
              data={journeys}
              renderItem={renderJourney}
              keyExtractor={(item) => String(item.enrollmentId)}
              contentContainerStyle={styles.list}
              ItemSeparatorComponent={() => (
                <View style={{ height: spacing[12] }} />
              )}
              refreshing={query.isRefetching}
              onRefresh={() => void query.refetch()}
              ListEmptyComponent={
                <AppText color="textSecondary" style={styles.message}>
                  {UI_COPY.journeys.empty}
                </AppText>
              }
              ListFooterComponent={
                query.hasNextPage ? (
                  <View style={styles.footer}>
                    <AppButton
                      variant="outline"
                      loading={query.isFetchingNextPage}
                      disabled={query.isFetchingNextPage}
                      onPress={() => void query.fetchNextPage()}
                    >
                      {UI_COPY.common.loadMore}
                    </AppButton>
                  </View>
                ) : undefined
              }
            />
          </>
        )}
      </View>
    </Screen>
  );
}
