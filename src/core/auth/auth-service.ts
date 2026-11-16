import { apiRequest } from "../api/api-client";
import { API_ENDPOINTS } from "../api/endpoints";
import type { ApiEnvelope } from "../api/types";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  SignupInput,
  SignupResponse,
} from "./types";
import { tokenStorage } from "./token-storage";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: input,
      authenticated: false,
    });
    await tokenStorage.save(response.data.tokens);
    return response.data;
  },

  async signup(input: SignupInput): Promise<SignupResponse> {
    const response = await apiRequest<SignupResponse>(API_ENDPOINTS.auth.signup, {
      method: "POST",
      body: input,
      authenticated: false,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiRequest<AuthUser>(API_ENDPOINTS.me.profile);
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiRequest<unknown>(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      body: { email },
      authenticated: false,
    });
  },

  async logout(): Promise<void> {
    const tokens = await tokenStorage.get();
    try {
      if (tokens?.refreshToken) {
        await apiRequest<undefined>(API_ENDPOINTS.auth.logout, {
          method: "POST",
          body: { refreshToken: tokens.refreshToken },
          authenticated: false,
        });
      }
    } finally {
      await tokenStorage.clear();
    }
  },
};
