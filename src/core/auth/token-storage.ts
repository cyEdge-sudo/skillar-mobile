import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '../constants/app.constants';
import { parseAuthTokens } from './validators';
import type { AuthTokens } from './types';

export const tokenStorage = {
  async get(): Promise<AuthTokens | null> {
    const serialized = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKENS);

    if (!serialized) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(serialized);
      return parseAuthTokens(parsed);
    } catch {
      await this.clear();
      return null;
    }
  },

  async save(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKENS);
  },
};
