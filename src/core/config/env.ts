import { ApiError } from "../api/api-error";
import {
  API_ERROR_CODES,
  APP_CONSTANTS,
  APP_MESSAGES,
} from "../constants/app.constants";

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
export const API_BASE_URL = rawApiBaseUrl?.replace(/\/+$/, "") ?? "";

function isLocalDevelopmentHost(hostname: string): boolean {
  const normalizedHostname = hostname.replace(/^\\[|\\]$/g, "").toLowerCase();

  if (
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname === "::1" ||
    normalizedHostname.endsWith(".local")
  ) {
    return true;
  }

  const octets = normalizedHostname.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return false;
  }

  const [first, second] = octets;
  return (
    first === 10 ||
    first === 127 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 169 && second === 254)
  );
}

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
