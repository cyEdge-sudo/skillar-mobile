import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "../../core/constants/app.constants";
import { roadmapDetailService } from "./roadmap-detail-service";
import { roadmapService } from "./roadmap-service";
import type { RoadmapListFilters } from "./types";

export function useRoadmaps(filters: RoadmapListFilters = {}) {
  return useInfiniteQuery({
    queryKey: [
      ...QUERY_KEYS.roadmaps,
      "catalog",
      filters.query?.trim() ?? "",
      filters.level ?? "all",
    ],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      roadmapService.list({ ...filters, cursor: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
}

export function useRoadmapDetail(roadmapId: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.roadmap(roadmapId),
    queryFn: ({ signal }) => roadmapDetailService.get(roadmapId, signal),
    enabled: enabled && roadmapId.length > 0,
  });
}

export function useEnrollRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roadmapService.enroll,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.enrollments }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps }),
      ]);
    },
  });
}
