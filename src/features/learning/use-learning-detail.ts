import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { APP_CONSTANTS, QUERY_KEYS } from '../../core/constants/app.constants';
import { learningDetailService } from './learning-detail-service';
import type { StepProgressStatus } from './types';

export function useEnrollmentDetail(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.enrollment(enrollmentId ?? ''),
    queryFn: ({ signal }) => {
      if (!enrollmentId) {
        throw new Error('A valid enrollment ID is required.');
      }
      return learningDetailService.getEnrollment(enrollmentId, signal);
    },
    enabled: typeof enrollmentId === 'string' && enrollmentId.length > 0,
  });
}

export function useStepContent(stepId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.stepContent(stepId),
    queryFn: ({ signal }) => learningDetailService.getStepContent(stepId, signal),
    enabled: stepId.length > 0,
    staleTime: APP_CONSTANTS.CONTENT_QUERY_STALE_TIME_MS,
    gcTime: APP_CONSTANTS.CONTENT_QUERY_GC_TIME_MS,
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
      queryFn: ({ signal }) => learningDetailService.getStepContent(stepId, signal),
      staleTime: APP_CONSTANTS.CONTENT_QUERY_STALE_TIME_MS,
      gcTime: APP_CONSTANTS.CONTENT_QUERY_GC_TIME_MS,
    });
  }, [queryClient, stepId]);
}

export function useStepAssessment(stepId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.stepAssessment(stepId),
    queryFn: ({ signal }) => learningDetailService.getAssessment(stepId, signal),
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
