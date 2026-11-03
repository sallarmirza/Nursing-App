// src/hooks/auth/useSignup.ts
import { useState } from "react";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";

export default function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const signup = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const signupResponse = await authService.signup({
        nurse_email: email,
        nurse_password: password,
      });

      // Auto-login immediately so tokens are set before the onboarding screen
      // calls /nurse/setup/{nurse_id}. Without this, setupProfile would either
      // send no token (403) or a stale token from a previous session (also 403).
      const loginResponse = await authService.login({
        nurse_email: email,
        nurse_password: password,
      });

      await login(
        {
          nurse_id: loginResponse.nurse.nurse_id,
          nurse_email: loginResponse.nurse.nurse_email,
        },
        {
          access_token: loginResponse.access_token,
          refresh_token: loginResponse.refresh_token,
        }
      );

      return signupResponse.nurse_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}