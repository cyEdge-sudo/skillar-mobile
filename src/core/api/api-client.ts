import {
  API_ERROR_CODES,
  API_ROUTES,
  APP_CONSTANTS,
  APP_MESSAGES,
  REQUEST_HEADERS,
  HTTP_METHODS,
} from '../constants/app.constants';
import { tokenStorage } from '../auth/token-storage';
import { parseAuthResponse } from '../auth/validators';
import type { AuthTokens } from '../auth/types';
import { getApiUrl } from '../config/env';
import { isRecord } from '../../shared/utils/is-record';
import { ApiError } from './api-error';
import type { ApiEnvelope, ApiRequestOptions, DataParser, ResponseMeta } from './types';

let refreshInFlight: Promise<AuthTokens> | null = null;
let onAuthenticationExpired: (() => void) | null = null;

export function setAuthenticationExpiredHandler(handler: (() => void) | null): void {
  onAuthenticationExpired = handler;
}

function createRequestId(): string {
  return (
    APP_CONSTANTS.REQUEST_ID_PREFIX +
    '-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}

function parseResponseMeta(value: unknown, fallbackRequestId: string): ResponseMeta {
  if (!isRecord(value)) {
    throw ApiError.invalidResponse(fallbackRequestId);
  }

  const requestId = typeof value.requestId === 'string' ? value.requestId : fallbackRequestId;

  if (value.pagination === undefined) {
    return { requestId };
  }

  if (!isRecord(value.pagination)) {
    throw ApiError.invalidResponse(requestId);
  }

  const nextCursor = value.pagination.nextCursor;
  const hasMore = value.pagination.hasMore;

  if ((nextCursor !== null && typeof nextCursor !== 'string') || typeof hasMore !== 'boolean') {
    throw ApiError.invalidResponse(requestId);
  }

  return {
    requestId,
    pagination: { nextCursor, hasMore },
  };
}

function parseEnvelope<TData>(
  payload: unknown,
  parseData: DataParser<TData>,
  requestId: string,
): ApiEnvelope<TData> {
  if (!isRecord(payload) || !('data' in payload)) {
    throw ApiError.invalidResponse(requestId);
  }

  return {
    data: parseData(payload.data),
    meta: parseResponseMeta(payload.meta, requestId),
  };
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get(REQUEST_HEADERS.CONTENT_TYPE) ?? '';

  if (!contentType.includes(REQUEST_HEADERS.JSON)) {
    return undefined;
  }

  try {
    const payload: unknown = await response.json();
    return payload;
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
  if (externalSignal?.aborted) {
    controller.abort();
  }
  const timeoutId = setTimeout(() => controller.abort(), APP_CONSTANTS.API_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();

  externalSignal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    const wasCancelled = externalSignal?.aborted === true;

    if (controller.signal.aborted) {
      throw ApiError.network(
        wasCancelled ? API_ERROR_CODES.REQUEST_CANCELLED : API_ERROR_CODES.REQUEST_TIMEOUT,
        wasCancelled ? APP_MESSAGES.requestCancelled : APP_MESSAGES.requestTimedOut,
      );
    }

    throw ApiError.network(API_ERROR_CODES.NETWORK_ERROR, APP_MESSAGES.networkUnavailable);
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', abortFromCaller);
  }
}

async function performTokenRefresh(): Promise<AuthTokens> {
  const currentTokens = await tokenStorage.get();

  if (!currentTokens) {
    throw ApiError.network(API_ERROR_CODES.REFRESH_TOKEN_MISSING, APP_MESSAGES.sessionExpired);
  }

  const requestId = createRequestId();
  const response = await fetchWithTimeout(getApiUrl(API_ROUTES.auth.refresh), {
    method: HTTP_METHODS.POST,
    headers: {
      [REQUEST_HEADERS.ACCEPT]: REQUEST_HEADERS.JSON,
      [REQUEST_HEADERS.CONTENT_TYPE]: REQUEST_HEADERS.JSON,
      [REQUEST_HEADERS.REQUEST_ID]: requestId,
    },
    body: JSON.stringify({
      refreshToken: currentTokens.refreshToken,
    }),
  });

  const payload = await readJson(response);
  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  const envelope = parseEnvelope(payload, parseAuthResponse, requestId);
  await tokenStorage.save(envelope.data.tokens);

  return envelope.data.tokens;
}

async function refreshTokens(): Promise<AuthTokens> {
  if (!refreshInFlight) {
    refreshInFlight = performTokenRefresh()
      .catch(async (error: unknown) => {
        // Preserve the session when refresh fails because of a network outage.
        if (
          error instanceof ApiError &&
          (error.status === 401 ||
            error.code === API_ERROR_CODES.UNAUTHENTICATED ||
            error.code === API_ERROR_CODES.SESSION_REVOKED ||
            error.code === API_ERROR_CODES.REFRESH_TOKEN_MISSING)
        ) {
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
      headers[REQUEST_HEADERS.AUTHORIZATION] = REQUEST_HEADERS.BEARER_PREFIX + tokens.accessToken;
    }
  }

  const response = await fetchWithTimeout(
    getApiUrl(path),
    {
      method: options.method ?? HTTP_METHODS.GET,
      headers,
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
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
        [REQUEST_HEADERS.AUTHORIZATION]: REQUEST_HEADERS.BEARER_PREFIX + tokens.accessToken,
      },
    });
  }

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  if (response.status === 204) {
    return {
      data: parseData(undefined),
      meta: { requestId },
    };
  }

  return parseEnvelope(payload, parseData, requestId);
}
