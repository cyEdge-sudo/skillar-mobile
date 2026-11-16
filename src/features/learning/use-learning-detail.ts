import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { QUERY_KEYS } from "../../core/constants/app.constants";
import { learningDetailService } from "./learning-detail-service";
import { roadmapDetailService } from "../roadmaps/roadmap-detail-service";
import type { StepProgressStatus } from "./types";

export function useRoadmapDetail(roadmapId: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.roadmap(roadmapId),
    queryFn: () => roadmapDetailService.get(roadmapId),
    enabled: enabled && roadmapId.length > 0,
  });
}

export function useEnrollmentDetail(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.enrollment(enrollmentId ?? ""),
    queryFn: () => {
      if (!enrollmentId) {
        throw new Error("A valid enrollment ID is required.");
      }
      return learningDetailService.getEnrollment(enrollmentId);
    },
    enabled: typeof enrollmentId === "string" && enrollmentId.length > 0,
  });
}

export function useStepContent(stepId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.stepContent(stepId),
    queryFn: () => learningDetailService.getStepContent(stepId),
    enabled: stepId.length > 0,
  });
}

export function usePrefetchStepContent(stepId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stepId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.stepContent(stepId),
      queryFn: () => learningDetailService.getStepContent(stepId),
    });
  }, [queryClient, stepId]);
}

export function useStepAssessment(stepId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.stepAssessment(stepId),
    queryFn: () => learningDetailService.getAssessment(stepId),
    enabled: enabled && stepId.length > 0,
    retry: false,
  });
}

export function useUpdateStepProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      enrollmentId: string;
      stepId: string;
      status: StepProgressStatus;
      progressPercent: number;
    }) =>
      learningDetailService.updateProgress(
        input.enrollmentId,
        input.stepId,
        input.status,
        input.progressPercent,
      ),
    onSuccess: async (_result, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.enrollment(input.enrollmentId),
        }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.enrollments }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.progress }),
      ]);
    },
  });
}
