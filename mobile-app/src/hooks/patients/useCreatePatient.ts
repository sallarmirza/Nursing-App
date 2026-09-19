// src/hooks/patients/useCreatePatient.ts
import { useState } from "react";
import { patientService } from "../../services/patients/patientService";
import { PatientCreateRequest } from "../../types/patient";
import { useAuth } from "../../context/AuthContext";

export function useCreatePatient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const createPatient = async (
    data: PatientCreateRequest
  ): Promise<string | null> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.create(nurse.nurse_id, data);
      return response.patient_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPatient, isLoading, error };
}