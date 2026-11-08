// src/hooks/medications/useMedications.ts
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { medicationService } from "../../services/medication/medicationService";
import { Medication, MedicationFormValues } from "../../types/medication";

export default function useMedications(patientId?: string) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchMedications = useCallback(async () => {
    if (!patientId) return;

    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await medicationService.list(nurse.nurse_id, patientId);
      setMedications(response.medications);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load medications"
      );
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  // Refetch every time the screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchMedications();
    }, [fetchMedications])
  );

  const addMedication = async (form: MedicationFormValues): Promise<boolean> => {
    if (!patientId) {
      setError("No patient selected");
      return false;
    }
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    const medName = form.medName.trim();
    const doseUnit = form.doseUnit.trim();
    const frequency = form.frequency.trim();
    const dose = Number(form.dose);

    if (!medName || !doseUnit || !frequency) {
      setError("Medication name, dose unit and frequency are required");
      return false;
    }
    if (!Number.isFinite(dose) || dose <= 0) {
      setError("Dose must be a number greater than zero");
      return false;
    }

    setIsMutating(true);
    setError(null);
    try {
      await medicationService.add(nurse.nurse_id, patientId, {
        med_name: medName,
        dose,
        dose_unit: doseUnit,
        frequency,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add medication");
      setIsMutating(false);
      return false;
    }

    setIsMutating(false);
    await fetchMedications();
    return true;
  };

  const removeMedication = async (medId: string): Promise<boolean> => {
    if (!patientId) {
      setError("No patient selected");
      return false;
    }
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    setIsMutating(true);
    setError(null);
    try {
      await medicationService.remove(nurse.nurse_id, patientId, medId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete medication"
      );
      setIsMutating(false);
      return false;
    }

    setIsMutating(false);
    await fetchMedications();
    return true;
  };

  return {
    medications,
    isLoading,
    isMutating,
    error,
    refetch: fetchMedications,
    addMedication,
    removeMedication,
  };
}