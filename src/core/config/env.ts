import { ApiError } from "../api/api-error";
import {
  API_ERROR_CODES,
  APP_CONSTANTS,
  APP_MESSAGES,
} from "../constants/app.constants";

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
export const API_BASE_URL = rawApiBaseUrl?.replace(/\/+$/, "") ?? "";

export function isAllowedApiBaseUrl(
  value: string,
  isProduction: boolean,
): boolean {
  try {
    const url = new URL(value);

    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username.length > 0 ||
      url.password.length > 0 ||
      url.search.length > 0 ||
      url.hash.length > 0
    ) {
      return false;
    }

    // Plain HTTP is permitted only for local development environments.
    return !isProduction || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getApiUrl(path: string): string {
  if (
    !API_BASE_URL ||
    !isAllowedApiBaseUrl(
      API_BASE_URL,
      process.env.NODE_ENV === "production",
    )
  ) {
    throw ApiError.network(
      API_ERROR_CODES.CONFIGURATION_ERROR,
      APP_MESSAGES.apiNotConfigured,
    );
  }

  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  return API_BASE_URL + APP_CONSTANTS.API_VERSION_PREFIX + normalizedPath;
}
