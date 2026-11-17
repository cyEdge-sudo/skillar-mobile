import { API_ERROR_CODES, APP_CONSTANTS } from '../constants/app.constants';
import { ApiError } from './api-error';

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= APP_CONSTANTS.QUERY_RETRY_COUNT) {
    return false;
  }

  if (error instanceof ApiError) {
    if (error.code === API_ERROR_CODES.REQUEST_CANCELLED) {
      return false;
    }

    return (
      error.status === 0 ||
      error.status === 408 ||
      error.status === 425 ||
      error.status === 429 ||
      error.status >= 500
    );
  }

  return false;
}

export function getQueryRetryDelay(attemptIndex: number): number {
  return Math.min(1_000 * 2 ** attemptIndex, 30_000);
}
