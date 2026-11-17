import {
  API_ERROR_CODES,
  API_FIELDS,
  APP_MESSAGES,
  AUTH_NEXT_STEPS,
} from '../constants/app.constants';
import { ApiError } from '../api/api-error';
import type { AuthResponse, AuthTokens, AuthUser, SignupResponse } from './types';
import { isRecord } from '../../shared/utils/is-record';

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
      details: [
        {
          field: fieldName,
          code: API_ERROR_CODES.INVALID_RESPONSE,
          message: APP_MESSAGES.invalidServerResponse,
        },
      ],
    });
  }

  return value;
}

function invalidPayload(message = APP_MESSAGES.invalidServerResponse): ApiError {
  return new ApiError(message, {
    status: 502,
    code: API_ERROR_CODES.INVALID_RESPONSE,
  });
}

export function parseAuthUser(value: unknown): AuthUser {
  if (!isRecord(value)) {
    throw invalidPayload();
  }

  return {
    id: requireString(value.id, API_FIELDS.USER_ID),
    name: requireString(value.name, API_FIELDS.USER_NAME),
    email: requireString(value.email, API_FIELDS.USER_EMAIL),
    avatarUrl: typeof value.avatarUrl === 'string' ? value.avatarUrl : null,
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
    accessToken: requireString(value.accessToken, API_FIELDS.ACCESS_TOKEN),
    refreshToken: requireString(value.refreshToken, API_FIELDS.REFRESH_TOKEN),
    accessTokenExpiresAt: requireString(
      value.accessTokenExpiresAt,
      API_FIELDS.ACCESS_TOKEN_EXPIRES_AT,
    ),
    refreshTokenExpiresAt: requireString(
      value.refreshTokenExpiresAt,
      API_FIELDS.REFRESH_TOKEN_EXPIRES_AT,
    ),
  };
}

export function parseAuthResponse(value: unknown): AuthResponse {
  if (!isRecord(value)) {
    throw invalidPayload();
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
    throw invalidPayload();
  }

  const nextStep = value.nextStep;
  if (
    nextStep !== undefined &&
    nextStep !== AUTH_NEXT_STEPS.VERIFY_EMAIL &&
    nextStep !== AUTH_NEXT_STEPS.LOGIN
  ) {
    throw invalidPayload();
  }

  return {
    user: {
      id: requireString(value.user.id, API_FIELDS.USER_ID),
      name: requireString(value.user.name, API_FIELDS.USER_NAME),
      email: requireString(value.user.email, API_FIELDS.USER_EMAIL),
    },
    nextStep: nextStep ?? AUTH_NEXT_STEPS.LOGIN,
  };
}

export function parseAcceptedAction(value: unknown): { accepted: boolean } {
  if (!isRecord(value) || typeof value.accepted !== 'boolean') {
    throw new ApiError(APP_MESSAGES.invalidPasswordResetResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
    });
  }

  return { accepted: value.accepted };
}

export function parseLoggedOut(value: unknown): { loggedOut: boolean } {
  if (!isRecord(value) || typeof value.loggedOut !== 'boolean') {
    throw new ApiError(APP_MESSAGES.invalidLogoutResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
    });
  }

  return { loggedOut: value.loggedOut };
}
