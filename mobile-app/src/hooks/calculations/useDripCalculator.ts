// src/hooks/calculations/useDripCalculator.ts
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { dripService } from "../../services/calculations/dripService";
import {
  DripCalculatorRequest,
  DripCalculatorResponse,
} from "../../types/calculations";

export function useDripCalculator() {
  const [result, setResult] = useState<DripCalculatorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Patient mode: the request behind the displayed result, so a save
  // always matches what the nurse is looking at.
  const [lastRequest, setLastRequest] = useState<DripCalculatorRequest | null>(
    null
  );
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { nurse } = useAuth();

  const calculate = async (data: DripCalculatorRequest) => {
    setIsLoading(true);
    setError(null);
    setSavedId(null);
    setSaveError(null);
    try {
      const response = await dripService.calculateSimple(data);
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
      setSaveError("Calculate a rate before saving");
      return false;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await dripService.calculateForPatient(
        nurse.nurse_id,
        patientId,
        lastRequest
      );
      setSavedId(response.drip_calc_id);
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
    setSavedId(null);
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
    savedId,
  };
}