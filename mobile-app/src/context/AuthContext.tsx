// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "nurse_session";

interface Nurse {
  nurse_id: string;
  nurse_name?: string;
  nurse_email: string;
}

interface AuthContextType {
  nurse: Nurse | null;
  setNurse: (nurse: Nurse | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nurse, setNurseState] = useState<Nurse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load any persisted session on app start
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
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

  // Wrap setNurse so every update also persists (or clears) storage
  const setNurse = (newNurse: Nurse | null) => {
    setNurseState(newNurse);
    if (newNurse) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNurse)).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ nurse, setNurse, isLoading }}>
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