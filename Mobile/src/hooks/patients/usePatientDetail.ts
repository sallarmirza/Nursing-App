// src/hooks/patients/usePatientDetail.ts
import { useState, useCallback } from "react";
import { patientService } from "../../services/patients/patientService";
import { PatientDetail } from "../../types/patient";
import { useAuth } from "../../context/AuthContext";

export default function usePatientDetail(patientId: string | undefined) {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchPatient = useCallback(async () => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }
    if (!patientId) {
      setError("No patient ID provided.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await patientService.getById(nurse.nurse_id, patientId);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patient");
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  return { patient, isLoading, error, fetchPatient };
}