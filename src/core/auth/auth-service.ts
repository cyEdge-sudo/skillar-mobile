import { API_ROUTES } from "../constants/app.constants";
import { apiRequest } from "../api/api-client";
import type { AuthResponse, AuthUser, LoginInput, SignupInput, SignupResponse } from "./types";
import {
  parseAuthResponse,
  parseCurrentUser,
  parseSignupResponse,
} from "./validators";
import { tokenStorage } from "./token-storage";

function parseResetRequestResponse(value: unknown): { accepted: boolean } {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !("accepted" in value) ||
    typeof value.accepted !== "boolean"
  ) {
    throw new Error("Invalid password reset response.");
  }

  return { accepted: value.accepted };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiRequest(
      API_ROUTES.auth.login,
      parseAuthResponse,
      {
        method: "POST",
        body: input,
        authenticated: false,
      },
    );

    await tokenStorage.save(response.data.tokens);
    return response.data;
  },

  async signup(input: SignupInput): Promise<SignupResponse> {
    const response = await apiRequest(
      API_ROUTES.auth.signup,
      parseSignupResponse,
      {
        method: "POST",
        body: input,
        authenticated: false,
      },
    );

    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiRequest(
      API_ROUTES.user.me,
      parseCurrentUser,
    );

    return response.data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiRequest(
      API_ROUTES.auth.forgotPassword,
      parseResetRequestResponse,
      {
        method: "POST",
        body: { email },
        authenticated: false,
      },
    );
  },

  async logout(): Promise<void> {
    const tokens = await tokenStorage.get();

    try {
      if (tokens?.refreshToken) {
        await apiRequest(
          API_ROUTES.auth.logout,
          () => undefined,
          {
            method: "POST",
            body: { refreshToken: tokens.refreshToken },
            authenticated: false,
          },
        );
      }
    } finally {
      await tokenStorage.clear();
    }
  },
};
