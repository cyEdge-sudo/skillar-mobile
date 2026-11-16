import { API_ROUTES, HTTP_METHODS } from "../constants/app.constants";
import { apiRequest } from "../api/api-client";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  SignupInput,
  SignupResponse,
} from "./types";
import {
  parseAcceptedAction,
  parseAuthResponse,
  parseCurrentUser,
  parseLoggedOut,
  parseSignupResponse,
} from "./validators";
import { tokenStorage } from "./token-storage";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiRequest(
      API_ROUTES.auth.login,
      parseAuthResponse,
      {
        method: HTTP_METHODS.POST,
        body: {
          email: input.email,
          password: input.password,
        },
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
        method: HTTP_METHODS.POST,
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
          dateOfBirth: input.dateOfBirth,
        },
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
      parseAcceptedAction,
      {
        method: HTTP_METHODS.POST,
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
          parseLoggedOut,
          {
            method: HTTP_METHODS.POST,
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
