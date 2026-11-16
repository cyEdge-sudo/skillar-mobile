import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { setAuthenticationExpiredHandler } from "../api/api-client";
import { ApiError } from "../api/api-error";
import {
  APP_MESSAGES,
  AUTH_STATUS,
} from "../constants/app.constants";
import { authService } from "./auth-service";
import type {
  AuthUser,
  LoginInput,
  SignupInput,
  SignupResponse,
} from "./types";
import { tokenStorage } from "./token-storage";

export type AuthStatus =
  (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: SignupInput) => Promise<SignupResponse>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  retrySessionRestore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>(AUTH_STATUS.RESTORING);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSessionExpired = useCallback(() => {
    queryClient.clear();
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    setError(null);
  }, [queryClient]);

  const restoreSession = useCallback(async () => {
    setStatus(AUTH_STATUS.RESTORING);
    setError(null);

    try {
      const tokens = await tokenStorage.get();
      if (!tokens) {
        setUser(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setStatus(AUTH_STATUS.AUTHENTICATED);
    } catch (restoreError: unknown) {
      if (
        restoreError instanceof ApiError &&
        [401, 403].includes(restoreError.status)
      ) {
        await tokenStorage.clear();
        setUser(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
        return;
      }

      setError(
        restoreError instanceof Error
          ? restoreError.message
          : APP_MESSAGES.restoreSessionFailed,
      );
      setStatus(AUTH_STATUS.ERROR);
    }
  }, []);

  useEffect(() => {
    setAuthenticationExpiredHandler(handleSessionExpired);
    void restoreSession();

    return () => setAuthenticationExpiredHandler(null);
  }, [handleSessionExpired, restoreSession]);

  const signIn = useCallback(async (input: LoginInput) => {
    setError(null);
    const response = await authService.login(input);
    setUser(response.user);
    setStatus(AUTH_STATUS.AUTHENTICATED);
  }, []);

  const signUp = useCallback(
    (input: SignupInput) => authService.signup(input),
    [],
  );

  const requestPasswordReset = useCallback(
    (email: string) => authService.requestPasswordReset(email),
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.clear();
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      setError(null);
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      retrySessionRestore: restoreSession,
    }),
    [status, user, error, signIn, signUp, signOut, requestPasswordReset, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(APP_MESSAGES.authProviderMissing);
  }
  return context;
}
