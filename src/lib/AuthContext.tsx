import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { appClient } from "@/api/appClient";

type AuthError = {
  type: string;
  message: string;
} | null;

type AuthContextValue = {
  user: any;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: AuthError;
  appPublicSettings: any;
  logout: (shouldRedirect?: boolean) => void;
  navigateToLogin: () => void;
  checkAppState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState<AuthError>(null);
  const [appPublicSettings] = useState<any>(null);

  const checkAppState = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const authenticated = await appClient.auth.isAuthenticated();
      if (!authenticated) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const currentUser = await appClient.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError({
        type: error?.status === 401 ? "auth_required" : "unknown",
        message: error?.message || "Authentication failed",
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAppState();
  }, []);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      appClient.auth.logout(window.location.href);
    } else {
      appClient.auth.logout();
    }
  };

  const navigateToLogin = () => {
    appClient.auth.redirectToLogin(window.location.href);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
    }),
    [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

