import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "../../core/constants/app.constants";
import { roadmapService } from "./roadmap-service";
import type { RoadmapListFilters } from "./types";

export function useRoadmaps(filters: RoadmapListFilters = {}) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.roadmaps,
      "catalog",
      filters.query?.trim() ?? "",
      filters.level ?? "all",
    ],
    queryFn: () => roadmapService.list(filters),
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
