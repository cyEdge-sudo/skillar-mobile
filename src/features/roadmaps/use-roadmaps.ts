import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "../../core/constants/app.constants";
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
    queryFn: ({ pageParam }) =>
      roadmapService.list({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
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
