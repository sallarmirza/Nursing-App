// src/hooks/patients/useDeletePatient.ts
import { useState } from "react";
import { patientService } from "../../services/patients/patientService";
import { useAuth } from "../../context/AuthContext";

export default function useDeletePatient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const deletePatient = async (patientId: string): Promise<boolean> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      await patientService.delete(nurse.nurse_id, patientId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete patient");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePatient, isLoading, error };
}
