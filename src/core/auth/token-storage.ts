import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { STORAGE_KEYS } from "../constants/app.constants";
import { parseAuthTokens } from "./validators";
import type { AuthTokens } from "./types";

type TokenStore = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

// expo-secure-store is not implemented on web, so web falls back to
// AsyncStorage (localStorage). Dev-preview compromise only; native builds
// keep credentials in platform secure storage.
const store: TokenStore =
  Platform.OS === "web"
    ? {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, value);
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      }
    : {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: async (key, value) => {
          await SecureStore.setItemAsync(key, value);
        },
        removeItem: async (key) => {
          await SecureStore.deleteItemAsync(key);
        },
      };

export const tokenStorage = {
  async get(): Promise<AuthTokens | null> {
    const serialized = await store.getItem(STORAGE_KEYS.AUTH_TOKENS);

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
    await store.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
  },

  async clear(): Promise<void> {
    await store.removeItem(STORAGE_KEYS.AUTH_TOKENS);
  },
};
