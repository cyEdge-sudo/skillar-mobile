import { AUTH_NEXT_STEPS } from "../constants/app.constants";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export type SignupNextStep =
  (typeof AUTH_NEXT_STEPS)[keyof typeof AUTH_NEXT_STEPS];

export interface SignupResponse {
  user: Pick<AuthUser, "id" | "name" | "email">;
  nextStep: SignupNextStep;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}
