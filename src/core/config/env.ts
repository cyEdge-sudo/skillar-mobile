const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = rawApiBaseUrl?.replace(/\/+$/, "") ?? "";
export const API_PREFIX = "/api/v1";
export const API_TIMEOUT_MS = 20_000;

export function getApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_BASE_URL in your environment.",
    );
  }

  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  return API_BASE_URL + API_PREFIX + normalizedPath;
}
