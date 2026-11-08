// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenManager } from "../services/auth/tokenManager";
import { apiClient } from "../services/api/client";

const STORAGE_KEY = "nurse_session";

interface Nurse {
  nurse_id: string;
  nurse_name?: string;
  nurse_email: string;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthContextType {
  nurse: Nurse | null;
  setNurse: (nurse: Nurse | null) => void;
  isLoading: boolean;
  login: (nurse: Nurse, tokens: Tokens) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nurse, setNurseState] = useState<Nurse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If a refresh ever fails (refresh token expired/revoked), tokenManager
    // calls this so we drop the session — navigation guard then sends the
    // nurse back to /login.
    tokenManager.setOnSessionExpired(() => {
      setNurseState(null);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    });

    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      tokenManager.loadFromStorage(),
    ])
      .then(([stored, { refreshToken }]) => {
        // Only restore the session if a refresh token actually came back with
        // it — a cached nurse profile with no refresh token is a stale session.
        if (stored && refreshToken) {
          setNurseState(JSON.parse(stored));
        }
      })
      .catch(() => {
        // Corrupted or inaccessible storage — just start with no session
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Unchanged from before — updates the cached profile only, no token change.
  const setNurse = (newNurse: Nurse | null) => {
    setNurseState(newNurse);
    if (newNurse) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNurse)).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }
  };

  // New — call this from the login screen with the full /nurse/login response.
  const login = async (newNurse: Nurse, tokens: Tokens) => {
    await tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
    setNurse(newNurse);
  };

  const logout = async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      // Best-effort — even if this fails (offline), we still clear locally.
      apiClient.post("/nurse/logout", { refresh_token: refreshToken }).catch(() => {});
    }
    await tokenManager.clear();
    setNurse(null);
  };

  return (
    <AuthContext.Provider value={{ nurse, setNurse, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}