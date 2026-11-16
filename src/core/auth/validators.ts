import { API_ERROR_CODES, APP_MESSAGES } from "../constants/app.constants";
import { ApiError } from "../api/api-error";
import type { AuthResponse, AuthTokens, AuthUser, SignupResponse } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  value: unknown,
  fieldName: string,
  requestId?: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
      requestId,
      details: [{ field: fieldName, code: API_ERROR_CODES.INVALID_RESPONSE, message: APP_MESSAGES.invalidServerResponse }],
    });
  }
  return value;
}

export function parseAuthUser(value: unknown): AuthUser {
  if (!isRecord(value)) {
    throw new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
    });
  }

  return {
    id: requireString(value.id, "user.id"),
    name: requireString(value.name, "user.name"),
    email: requireString(value.email, "user.email"),
    avatarUrl: typeof value.avatarUrl === "string" ? value.avatarUrl : null,
  };
}

export function parseAuthTokens(value: unknown): AuthTokens {
  if (!isRecord(value)) {
    throw new ApiError(APP_MESSAGES.invalidTokenResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_TOKEN_RESPONSE,
    });
  }

  return {
    accessToken: requireString(value.accessToken, "tokens.accessToken"),
    refreshToken: requireString(value.refreshToken, "tokens.refreshToken"),
    accessTokenExpiresAt: requireString(
      value.accessTokenExpiresAt,
      "tokens.accessTokenExpiresAt",
    ),
    refreshTokenExpiresAt: requireString(
      value.refreshTokenExpiresAt,
      "tokens.refreshTokenExpiresAt",
    ),
  };
}

export function parseAuthResponse(value: unknown): AuthResponse {
  if (!isRecord(value)) {
    throw new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
    });
  }

  return {
    user: parseAuthUser(value.user),
    tokens: parseAuthTokens(value.tokens),
  };
}

export function parseCurrentUser(value: unknown): AuthUser {
  return parseAuthUser(value);
}

export function parseSignupResponse(value: unknown): SignupResponse {
  if (!isRecord(value) || !isRecord(value.user)) {
    throw new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
    });
  }

  const nextStep =
    typeof value.nextStep === "string" ? value.nextStep : "login";

  return {
    user: {
      id: requireString(value.user.id, "user.id"),
      name: requireString(value.user.name, "user.name"),
      email: requireString(value.user.email, "user.email"),
    },
    nextStep,
  };
}
