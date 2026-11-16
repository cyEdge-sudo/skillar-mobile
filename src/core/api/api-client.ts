import {
  API_ERROR_CODES,
  API_ROUTES,
  APP_CONSTANTS,
  APP_MESSAGES,
  REQUEST_HEADERS,
} from "../constants/app.constants";
import { ApiError } from "./api-error";
import type {
  ApiEnvelope,
  ApiRequestOptions,
  DataParser,
  ResponseMeta,
} from "./types";
import { getApiUrl } from "../config/env";
import { tokenStorage } from "../auth/token-storage";
import { parseAuthResponse, parseAuthTokens } from "../auth/validators";
import type { AuthTokens } from "../auth/types";

let refreshInFlight: Promise<AuthTokens> | null = null;
let onAuthenticationExpired: (() => void) | null = null;

export function setAuthenticationExpiredHandler(
  handler: (() => void) | null,
): void {
  onAuthenticationExpired = handler;
}

function createRequestId(): string {
  return (
    APP_CONSTANTS.REQUEST_ID_PREFIX +
    "-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 10)
  );
}

function parseResponseMeta(value: unknown, fallbackRequestId: string): ResponseMeta {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { requestId: fallbackRequestId };
  }

  const meta = value as Record<string, unknown>;
  const requestId =
    typeof meta.requestId === "string" ? meta.requestId : fallbackRequestId;

  if (meta.pagination === undefined) {
    return { requestId };
  }

  if (
    typeof meta.pagination !== "object" ||
    meta.pagination === null ||
    Array.isArray(meta.pagination)
  ) {
    throw ApiError.invalidResponse(requestId);
  }

  const pagination = meta.pagination as Record<string, unknown>;
  if (
    (pagination.nextCursor !== null &&
      typeof pagination.nextCursor !== "string") ||
    typeof pagination.hasMore !== "boolean"
  ) {
    throw ApiError.invalidResponse(requestId);
  }

  return {
    requestId,
    pagination: {
      nextCursor: pagination.nextCursor as string | null,
      hasMore: pagination.hasMore,
    },
  };
}

function parseEnvelope<TData>(
  payload: unknown,
  parseData: DataParser<TData>,
  requestId: string,
): ApiEnvelope<TData> {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload) ||
    !("data" in payload)
  ) {
    throw ApiError.invalidResponse(requestId);
  }

  const record = payload as Record<string, unknown>;
  return {
    data: parseData(record.data),
    meta: parseResponseMeta(record.meta, requestId),
  };
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType =
    response.headers.get(REQUEST_HEADERS.CONTENT_TYPE) ?? "";
  if (!contentType.includes(REQUEST_HEADERS.JSON)) {
    return undefined;
  }

  try {
    const value: unknown = await response.json();
    return value;
  } catch {
    return undefined;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    APP_CONSTANTS.API_TIMEOUT_MS,
  );
  const abortFromCaller = () => controller.abort();

  externalSignal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    if (controller.signal.aborted) {
      const cancelled = externalSignal?.aborted === true;
      throw ApiError.network(
        cancelled
          ? API_ERROR_CODES.REQUEST_CANCELLED
          : API_ERROR_CODES.REQUEST_TIMEOUT,
        cancelled
          ? APP_MESSAGES.requestCancelled
          : APP_MESSAGES.requestTimedOut,
      );
    }

    throw ApiError.network(
      API_ERROR_CODES.NETWORK_ERROR,
      APP_MESSAGES.networkUnavailable,
    );
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromCaller);
  }
}

async function performTokenRefresh(): Promise<AuthTokens> {
  const currentTokens = await tokenStorage.get();

  if (!currentTokens) {
    throw ApiError.network(
      API_ERROR_CODES.REFRESH_TOKEN_MISSING,
      APP_MESSAGES.sessionExpired,
    );
  }

  const requestId = createRequestId();
  const response = await fetchWithTimeout(
    getApiUrl(API_ROUTES.auth.refresh),
    {
      method: "POST",
      headers: {
        [REQUEST_HEADERS.ACCEPT]: REQUEST_HEADERS.JSON,
        [REQUEST_HEADERS.CONTENT_TYPE]: REQUEST_HEADERS.JSON,
        [REQUEST_HEADERS.REQUEST_ID]: requestId,
      },
      body: JSON.stringify({
        refreshToken: currentTokens.refreshToken,
      }),
    },
  );

  const payload = await readJson(response);
  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  const envelope = parseEnvelope(
    payload,
    parseAuthResponse,
    requestId,
  );

  // Parse the tokens once more at the storage boundary.
  const tokens = parseAuthTokens(envelope.data.tokens);
  await tokenStorage.save(tokens);
  return tokens;
}

async function refreshTokens(): Promise<AuthTokens> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = performTokenRefresh()
    .catch(async (error: unknown) => {
      // Keep tokens on network/server outages. Clear only a rejected session.
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        await tokenStorage.clear();
        onAuthenticationExpired?.();
      }
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function apiRequest<TData>(
  path: string,
  parseData: DataParser<TData>,
  options: ApiRequestOptions = {},
): Promise<ApiEnvelope<TData>> {
  const requestId = createRequestId();
  const authenticated = options.authenticated ?? true;
  const headers: Record<string, string> = {
    [REQUEST_HEADERS.ACCEPT]: REQUEST_HEADERS.JSON,
    [REQUEST_HEADERS.REQUEST_ID]: requestId,
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers[REQUEST_HEADERS.CONTENT_TYPE] = REQUEST_HEADERS.JSON;
  }

  if (options.idempotencyKey) {
    headers[REQUEST_HEADERS.IDEMPOTENCY_KEY] = options.idempotencyKey;
  }

  if (authenticated) {
    const tokens = await tokenStorage.get();
    if (tokens) {
      headers[REQUEST_HEADERS.AUTHORIZATION] =
        REQUEST_HEADERS.BEARER_PREFIX + tokens.accessToken;
    }
  }

  const response = await fetchWithTimeout(
    getApiUrl(path),
    {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    },
    options.signal,
  );

  const payload = await readJson(response);

  if (response.status === 401 && authenticated && options.retryAuth !== false) {
    const tokens = await refreshTokens();
    return apiRequest(path, parseData, {
      ...options,
      retryAuth: false,
      headers: {
        ...options.headers,
        [REQUEST_HEADERS.AUTHORIZATION]:
          REQUEST_HEADERS.BEARER_PREFIX + tokens.accessToken,
      },
    });
  }

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  if (response.status === 204) {
    return {
      data: undefined as TData,
      meta: { requestId },
    };
  }

  return parseEnvelope(payload, parseData, requestId);
}
