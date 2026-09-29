// src/hooks/auth/useLogin.ts
import { useState } from "react";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: loginToContext } = useAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({
        nurse_email: email,
        nurse_password: password,
      });

      await loginToContext(
        {
          nurse_id: response.nurse.nurse_id,
          nurse_name: response.nurse.nurse_name ?? undefined,
          nurse_email: response.nurse.nurse_email,
        },
        {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        }
      );

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