import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../core/constants/app.constants';
import { learningService } from './learning-service';

export function useLearningEnrollments() {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.enrollments, 'list'],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => learningService.listEnrollments(pageParam, signal),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
