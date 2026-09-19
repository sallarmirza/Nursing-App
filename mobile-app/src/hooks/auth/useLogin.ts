// src/hooks/auth/useLogin.ts
import { useState } from "react";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setNurse } = useAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({
        nurse_email: email,
        nurse_password: password,
      });
      setNurse({
        nurse_id: response.nurse_id,
        nurse_name: response.nurse_name ?? undefined,
        nurse_email: response.nurse_email,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}