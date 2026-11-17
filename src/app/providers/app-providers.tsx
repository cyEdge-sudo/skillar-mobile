import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  getQueryRetryDelay,
  shouldRetryQuery,
} from "../../core/api/query-retry";
import { APP_CONSTANTS } from "../../core/constants/app.constants";
import { AuthProvider } from "../../core/auth/auth-context";
import { ThemeProvider } from "../../shared/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONSTANTS.QUERY_STALE_TIME_MS,
      gcTime: APP_CONSTANTS.QUERY_GC_TIME_MS,
      retry: shouldRetryQuery,
      retryDelay: getQueryRetryDelay,
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
