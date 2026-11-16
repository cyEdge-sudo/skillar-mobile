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
import { authService } from "./auth-service";
import type { AuthUser, LoginInput, SignupInput, SignupResponse } from "./types";
import { tokenStorage } from "./token-storage";

export type AuthStatus =
  | "restoring"
  | "authenticated"
  | "unauthenticated"
  | "error";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: SignupInput) => Promise<SignupResponse>;
  signOut: () => Promise<void>;
  retrySessionRestore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("restoring");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
  }, []);

  const restoreSession = useCallback(async () => {
    setStatus("restoring");
    setError(null);

    try {
      const tokens = await tokenStorage.get();
      if (!tokens) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch (restoreError) {
      if (
        restoreError instanceof ApiError &&
        [401, 403].includes(restoreError.status)
      ) {
        await tokenStorage.clear();
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setError(
        restoreError instanceof Error
          ? restoreError.message
          : "Unable to restore your session.",
      );
      setStatus("error");
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
    setStatus("authenticated");
  }, []);

  const signUp = useCallback(
    async (input: SignupInput) => authService.signup(input),
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      setError(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      signIn,
      signUp,
      signOut,
      retrySessionRestore: restoreSession,
    }),
    [status, user, error, signIn, signUp, signOut, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
