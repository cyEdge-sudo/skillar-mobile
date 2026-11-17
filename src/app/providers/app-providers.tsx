import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ApiError } from "../../core/api/api-error";
import {
  API_ERROR_CODES,
  APP_CONSTANTS,
} from "../../core/constants/app.constants";
import { AuthProvider } from "../../core/auth/auth-context";
import { ThemeProvider } from "../../shared/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONSTANTS.QUERY_STALE_TIME_MS,
      gcTime: APP_CONSTANTS.QUERY_GC_TIME_MS,
      retry: (failureCount, error: unknown) => {
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

        return true;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1_000 * 2 ** attemptIndex, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
