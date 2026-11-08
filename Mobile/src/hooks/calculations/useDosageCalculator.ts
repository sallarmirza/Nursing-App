// src/hooks/calculations/useDosageCalculator.ts
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { dosageService } from "../../services/calculations/dosageService";
import {
  DosageCalculatorRequest,
  DosageCalculatorResponse,
} from "../../types/calculations";

export function useDosageCalculator() {
  const [result, setResult] = useState<DosageCalculatorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Patient mode: the request behind the displayed result, so a save
  // always matches what the nurse is looking at.
  const [lastRequest, setLastRequest] =
    useState<DosageCalculatorRequest | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { nurse } = useAuth();

  const calculate = async (data: DosageCalculatorRequest) => {
    setIsLoading(true);
    setError(null);
    setIsSaved(false);
    setSaveError(null);
    try {
      const response = await dosageService.calculateSimple(data);
      setResult(response);
      setLastRequest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
      setResult(null);
      setLastRequest(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToRecord = async (patientId: string): Promise<boolean> => {
    if (!nurse) {
      setSaveError("No nurse session found. Please log in again.");
      return false;
    }
    if (!lastRequest) {
      setSaveError("Calculate a dose before saving");
      return false;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      await dosageService.calculateForPatient(
        nurse.nurse_id,
        patientId,
        lastRequest
      );
      setIsSaved(true);
      return true;
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLastRequest(null);
    setIsSaved(false);
    setSaveError(null);
  };

  return {
    result,
    isLoading,
    error,
    calculate,
    reset,
    saveToRecord,
    isSaving,
    saveError,
    isSaved,
  };
}