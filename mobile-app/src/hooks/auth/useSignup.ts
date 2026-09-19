// src/hooks/auth/useSignup.ts
import { useState } from "react";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";

export default function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setNurse } = useAuth();

  const signup = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({
        nurse_email: email,
        nurse_password: password,
      });
      // Signup only returns nurse_id + message — name isn't known yet
      // until the profile-setup step, which comes next in the flow.
      setNurse({ nurse_id: response.nurse_id, nurse_email: email });
      return response.nurse_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}