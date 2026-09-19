// src/hooks/patients/usePatientList.ts
import { useState, useCallback } from "react";
import { patientService } from "../../services/patients/patientService";
import { PatientListItem } from "../../types/patient";
import { useAuth } from "../../context/AuthContext";

export default function usePatientList() {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchPatients = useCallback(async () => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await patientService.listAll(nurse.nurse_id);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  }, [nurse]);

  return { patients, isLoading, error, fetchPatients };
}