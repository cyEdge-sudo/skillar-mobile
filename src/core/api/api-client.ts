import { API_TIMEOUT_MS, getApiUrl } from "../config/env";
import { tokenStorage } from "../auth/token-storage";
import type { AuthResponse, AuthTokens } from "../auth/types";
import { ApiError } from "./api-error";
import type { ApiEnvelope } from "./types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  authenticated?: boolean;
  headers?: Record<string, string>;
  idempotencyKey?: string;
  signal?: AbortSignal;
  retryAuth?: boolean;
}

let refreshInFlight: Promise<AuthTokens> | null = null;
let onAuthenticationExpired: (() => void) | null = null;

export function setAuthenticationExpiredHandler(
  handler: (() => void) | null,
): void {
  onAuthenticationExpired = handler;
}

function createRequestId(): string {
  return "mob-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function asApiEnvelope<T>(payload: unknown, requestId: string): ApiEnvelope<T> {
  if (payload === null || typeof payload !== "object" || !("data" in payload)) {
    throw new ApiError("The server returned an invalid response.", {
      status: 502,
      code: "INVALID_RESPONSE",
      requestId,
    });
  }

  return payload as ApiEnvelope<T>;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();

  externalSignal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    if (controller.signal.aborted) {
      throw new ApiError(
        externalSignal?.aborted
          ? "The request was cancelled."
          : "The request timed out. Please try again.",
        {
          status: 0,
          code: externalSignal?.aborted ? "REQUEST_CANCELLED" : "REQUEST_TIMEOUT",
        },
      );
    }

    throw new ApiError("Unable to connect to the service.", {
      status: 0,
      code: "NETWORK_ERROR",
    });
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
  }
}

async function performTokenRefresh(): Promise<AuthTokens> {
  const current = await tokenStorage.get();
  if (!current?.refreshToken) {
    throw new ApiError("Your session has expired. Please sign in again.", {
      status: 401,
      code: "REFRESH_TOKEN_MISSING",
    });
  }

  const requestId = createRequestId();
  const response = await fetchWithTimeout(
    getApiUrl("/auth/refresh"),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
      },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    },
  );

  const payload = await readJson(response);
  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  const envelope = asApiEnvelope<AuthResponse>(payload, requestId);
  const tokens = envelope.data?.tokens;
  if (
    !tokens?.accessToken ||
    !tokens.refreshToken ||
    !tokens.accessTokenExpiresAt ||
    !tokens.refreshTokenExpiresAt
  ) {
    throw new ApiError("The server returned an invalid token response.", {
      status: 502,
      code: "INVALID_TOKEN_RESPONSE",
      requestId,
    });
  }

  // Persist the rotated pair together in one secure-store value.
  await tokenStorage.save(tokens);
  return tokens;
}

async function refreshTokens(): Promise<AuthTokens> {
  if (!refreshInFlight) {
    refreshInFlight = performTokenRefresh()
      .catch(async (error: unknown) => {
        // A network failure must not erase a session that may still be valid.
        if (error instanceof ApiError && [401, 403].includes(error.status)) {
          await tokenStorage.clear();
          onAuthenticationExpired?.();
        }
        throw error;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const requestId = createRequestId();
  const authenticated = options.authenticated ?? true;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Request-Id": requestId,
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  if (authenticated) {
    const tokens = await tokenStorage.get();
    if (tokens?.accessToken) {
      headers.Authorization = "Bearer " + tokens.accessToken;
    }
  }

  const response = await fetchWithTimeout(
    getApiUrl(path),
    {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    },
    options.signal,
  );

  const payload = await readJson(response);

  if (response.status === 401 && authenticated && options.retryAuth !== false) {
    const tokens = await refreshTokens();
    return apiRequest<T>(path, {
      ...options,
      retryAuth: false,
      headers: {
        ...options.headers,
        Authorization: "Bearer " + tokens.accessToken,
      },
    });
  }

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  if (response.status === 204) {
    return { data: undefined as T, meta: { requestId } };
  }

  return asApiEnvelope<T>(payload, requestId);
}
