import * as SecureStore from "expo-secure-store";

import type { AuthTokens } from "./types";

const AUTH_TOKENS_KEY = "skillar.auth.tokens.v1";

/**
 * Store the token pair as one serialized value.
 * This avoids leaving a rotated access token paired with an old refresh token.
 */
export const tokenStorage = {
  async get(): Promise<AuthTokens | null> {
    const serialized = await SecureStore.getItemAsync(AUTH_TOKENS_KEY);
    if (!serialized) {
      return null;
    }

    try {
      const parsed = JSON.parse(serialized) as AuthTokens;
      if (
        typeof parsed.accessToken !== "string" ||
        typeof parsed.refreshToken !== "string" ||
        typeof parsed.accessTokenExpiresAt !== "string" ||
        typeof parsed.refreshTokenExpiresAt !== "string"
      ) {
        await this.clear();
        return null;
      }
      return parsed;
    } catch {
      await this.clear();
      return null;
    }
  },

  async save(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKENS_KEY, JSON.stringify(tokens));
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKENS_KEY);
  },
};
