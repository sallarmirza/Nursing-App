// src/hooks/auth/useProfileSetup.ts
import { useState } from "react";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";

export function useProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse, setNurse } = useAuth();

  const setupProfile = async (
    nurseName: string,
    qualification: string,
    designation: string,
    hospital: string,
    experienceYears: number
  ): Promise<boolean> => {
    if (!nurse) {
      setError("No nurse session found. Please sign up again.");
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.setupProfile(nurse.nurse_id, {
        nurse_name: nurseName,
        nurse_qualification: qualification || undefined,
        nurse_designation: designation || undefined,
        nurse_hospital: hospital || undefined,
        nurse_experience: experienceYears,
      });
      // Profile setup succeeded — nurse_name is now known, update context
      setNurse({ ...nurse, nurse_name: nurseName });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile setup failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { setupProfile, isLoading, error };
}