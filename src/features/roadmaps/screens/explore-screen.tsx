import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppButton, AppCard, AppChip, AppText, Screen } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import { useEnrollRoadmap, useRoadmaps } from "../use-roadmaps";
import { UI_COPY } from "../../../core/constants/app.constants";
import type { RoadmapLevel, RoadmapSummary } from "../types";

const LEVEL_FILTERS: Array<{ label: string; value: RoadmapLevel | null }> = [
  { label: UI_COPY.roadmaps.levelFilters.all, value: null },
  { label: UI_COPY.roadmaps.levelFilters.beginner, value: "beginner" },
  { label: UI_COPY.roadmaps.levelFilters.intermediate, value: "intermediate" },
  { label: UI_COPY.roadmaps.levelFilters.advanced, value: "advanced" },
];

export interface ExploreScreenProps {
  enrollmentsByRoadmapId: ReadonlyMap<string, string>;
  onOpenRoadmapDetail: (roadmapId: string, enrollmentId?: string) => void;
}

export function ExploreScreen({ enrollmentsByRoadmapId, onOpenRoadmapDetail }: ExploreScreenProps) {
  const { colors, spacing, radius } = useTheme();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<RoadmapLevel | null>(null);
  const roadmapsQuery = useRoadmaps({
    query: searchQuery,
    level: selectedLevel,
    limit: 20,
  });
  const enrollMutation = useEnrollRoadmap();
  const roadmaps = roadmapsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, gap: spacing[16] },
    heading: { gap: spacing[4] },
    search: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius[8],
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: spacing[16],
      fontSize: 16,
    },
    filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing[8] },
    list: { gap: spacing[12], paddingBottom: spacing[32] },
    card: { gap: spacing[12] },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing[8],
    },
    metadata: { flexDirection: "row", flexWrap: "wrap", gap: spacing[12] },
    skillAreas: { flexDirection: "row", flexWrap: "wrap", gap: spacing[8] },
    message: { textAlign: "center", paddingVertical: spacing[24] },
    error: { gap: spacing[12], alignItems: "center", paddingVertical: spacing[24] },
    footer: { paddingVertical: spacing[16], alignItems: "center" },
  });

  const renderRoadmap = ({ item }: { item: RoadmapSummary }) => {
    const enrollmentId = enrollmentsByRoadmapId.get(item.id);
    const isEnrolled = enrollmentId !== undefined;
    const isEnrolling =
      enrollMutation.isPending && enrollMutation.variables === item.id;

    return (
      <AppCard variant="outlined" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, gap: spacing[4] }}>
            <AppText variant="titleMedium">{item.title}</AppText>
            {item.level ? (
              <AppText color="textSecondary" variant="labelMedium">
                {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
              </AppText>
            ) : null}
          </View>
          <AppText color="textSecondary" variant="labelSmall">
            {item.language.toUpperCase()}
          </AppText>
        </View>

        {item.description ? (
          <AppText color="textSecondary">{item.description}</AppText>
        ) : null}

        <View style={styles.metadata}>
          <AppText variant="labelMedium" color="textSecondary">
            {item.totalHours} {UI_COPY.roadmaps.hoursSuffix}
          </AppText>
          {item.estimatedWeeks !== null ? (
            <AppText variant="labelMedium" color="textSecondary">
              {item.estimatedWeeks} {UI_COPY.roadmaps.weeksSuffix}
            </AppText>
          ) : null}
        </View>

        {item.skillAreas.length > 0 ? (
          <View style={styles.skillAreas}>
            {item.skillAreas.slice(0, 4).map((skillArea) => (
              <AppChip key={skillArea} label={skillArea} size="small" />
            ))}
          </View>
        ) : null}

        <AppButton
          variant="outline"
          onPress={() => onOpenRoadmapDetail(item.id, enrollmentId)}
        >
          {UI_COPY.roadmaps.viewDetails}
        </AppButton>
        <AppButton
          onPress={() => {
            enrollMutation.mutate(item.id);
          }}
          disabled={isEnrolled || enrollMutation.isPending}
          loading={isEnrolling}
          variant={isEnrolled ? "outline" : "solid"}
          accessibilityLabel={
            isEnrolled ? item.title + " " + UI_COPY.roadmaps.enrolledAccessibilitySuffix : UI_COPY.roadmaps.enrollAccessibilityPrefix + item.title
          }
        >
          {isEnrolled ? UI_COPY.roadmaps.enrolled : UI_COPY.roadmaps.enroll}
        </AppButton>
      </AppCard>
    );
  };

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.heading}>
          <AppText variant="headlineSmall">{UI_COPY.roadmaps.exploreTitle}</AppText>
          <AppText color="textSecondary">
            {UI_COPY.roadmaps.exploreDescription}
          </AppText>
        </View>

        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={() => setSearchQuery(searchInput.trim())}
          placeholder={UI_COPY.roadmaps.searchPlaceholder}
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          accessibilityLabel={UI_COPY.roadmaps.searchAccessibilityLabel}
          style={styles.search}
        />

        <View style={styles.filters}>
          {LEVEL_FILTERS.map((filter) => (
            <AppChip
              key={filter.label}
              label={filter.label}
              selected={selectedLevel === filter.value}
              onPress={() => setSelectedLevel(filter.value)}
              accessibilityLabel={UI_COPY.roadmaps.filterAccessibilityPrefix + filter.label}
              accessibilityState={{ selected: selectedLevel === filter.value }}
            />
          ))}
        </View>

        {roadmapsQuery.isLoading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color="textSecondary">{UI_COPY.roadmaps.loading}</AppText>
          </View>
        ) : roadmapsQuery.isError ? (
          <View style={styles.error}>
            <AppText variant="titleMedium">{UI_COPY.roadmaps.unavailable}</AppText>
            <AppText color="textSecondary">
              {roadmapsQuery.error instanceof Error
                ? roadmapsQuery.error.message
                : UI_COPY.roadmaps.retryMessage}
            </AppText>
            <AppButton
              variant="outline"
              onPress={() => void roadmapsQuery.refetch()}
            >
              {UI_COPY.common.retry}
            </AppButton>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={roadmaps}
            renderItem={renderRoadmap}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing[12] }} />}
            keyboardShouldPersistTaps="handled"
            refreshing={roadmapsQuery.isRefetching}
            onRefresh={() => void roadmapsQuery.refetch()}
            ListEmptyComponent={() => (
              <AppText color="textSecondary" style={styles.message}>
                {UI_COPY.roadmaps.noMatches}
              </AppText>
            )}
            ListFooterComponent={
              roadmapsQuery.hasNextPage ? (
                <View style={styles.footer}>
                  <AppButton
                    variant="outline"
                    loading={roadmapsQuery.isFetchingNextPage}
                    disabled={roadmapsQuery.isFetchingNextPage}
                    onPress={() => void roadmapsQuery.fetchNextPage()}
                  >
                    {UI_COPY.common.loadMore}
                  </AppButton>
                </View>
              ) : undefined
            }
          />
        )}

        {enrollMutation.isError ? (
          <AppText color="error">
            {enrollMutation.error instanceof Error
              ? enrollMutation.error.message
              : UI_COPY.roadmaps.enrollFailedMessage}
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}
