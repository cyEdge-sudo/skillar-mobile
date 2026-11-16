import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { APP_CONSTANTS, QUERY_KEYS } from "../../core/constants/app.constants";
import { journeysService } from "./journeys-service";

export function useJourneys() {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.journeys, "list"],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => journeysService.list(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor
        ? lastPage.nextCursor
        : undefined,
    staleTime: APP_CONSTANTS.QUERY_STALE_TIME_MS,
  });
}

export function useJourneyDetail(enrollmentId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.journey(enrollmentId),
    queryFn: () => journeysService.getDetail(enrollmentId),
    enabled: Number.isSafeInteger(enrollmentId) && enrollmentId > 0,
    staleTime: APP_CONSTANTS.CONTENT_QUERY_STALE_TIME_MS,
  });
}

export function useCompleteJourneyActivity(enrollmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: number) =>
      journeysService.completeActivity(enrollmentId, activityId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.journey(enrollmentId),
        }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journeys }),
      ]);
    },
  });
}
