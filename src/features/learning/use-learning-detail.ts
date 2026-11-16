import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export function useEnrollmentDetail(enrollmentId: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.enrollment(String(enrollmentId ?? "")),
    queryFn: () => {
      if (typeof enrollmentId !== "number") {
        throw new Error("A valid enrollment ID is required.");
      }
      return learningDetailService.getEnrollment(enrollmentId);
    },
    enabled: typeof enrollmentId === "number" && Number.isInteger(enrollmentId),
  });
}

export function useStepContent(stepId: string) {
  return useQuery({
    queryKey: ["skillar", "steps", stepId, "content"],
    queryFn: () => learningDetailService.getStepContent(stepId),
    enabled: stepId.length > 0,
  });
}

export function useStepAssessment(stepId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["skillar", "steps", stepId, "assessment"],
    queryFn: () => learningDetailService.getAssessment(stepId),
    enabled: enabled && stepId.length > 0,
    retry: false,
  });
}

export function useUpdateStepProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      enrollmentId: number;
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
          queryKey: QUERY_KEYS.enrollment(String(input.enrollmentId)),
        }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.enrollments }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.progress }),
      ]);
    },
  });
}
