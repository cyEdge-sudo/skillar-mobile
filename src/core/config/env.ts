import { ApiError } from "../api/api-error";
import {
  API_ERROR_CODES,
  APP_CONSTANTS,
  APP_MESSAGES,
} from "../constants/app.constants";

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
export const API_BASE_URL = rawApiBaseUrl?.replace(/\/+$/, "") ?? "";

export function getApiUrl(path: string): string {
  if (!API_BASE_URL || !/^https?:\/\//i.test(API_BASE_URL)) {
    throw ApiError.network(
      API_ERROR_CODES.CONFIGURATION_ERROR,
      APP_MESSAGES.apiNotConfigured,
    );
  }

  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  return API_BASE_URL + APP_CONSTANTS.API_VERSION_PREFIX + normalizedPath;
}
