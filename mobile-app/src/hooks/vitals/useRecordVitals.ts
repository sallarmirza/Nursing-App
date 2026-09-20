// src/hooks/vitals/useRecordVitals.ts
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { vitalsService } from "../../services/vitals/vitalsService";
import {
  VitalsData,
  VitalsFormValues,
  VitalsSource,
} from "../../types/vital";

const NUMERIC_FIELDS: Array<[keyof VitalsFormValues, string, string]> = [
  ["hr", "heart_rate", "Heart rate"],
  ["rr", "respiratory_rate", "Respiratory rate"],
  ["spO2", "spo2", "SpO2"],
  ["temp", "temperature_f", "Temperature"],
];

function buildVitalsData(
  form: VitalsFormValues
): { data: VitalsData } | { error: string } {
  const data: VitalsData = {};

  const bp = form.bp.trim();
  if (bp) {
    if (!/^\d{2,3}\/\d{2,3}$/.test(bp)) {
      return { error: "BP must look like 120/80" };
    }
    data.bp = bp;
  }

  for (const [field, key, label] of NUMERIC_FIELDS) {
    const raw = form[field].trim();
    if (!raw) continue;

    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) {
      return { error: `${label} must be a positive number` };
    }
    data[key] = value;
  }

  return { data };
}

export default function useRecordVitals() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  // Returns true when vitals were saved OR there was nothing to save.
  const recordVitals = async (
    patientId: string,
    source: VitalsSource,
    form: VitalsFormValues
  ): Promise<boolean> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    const built = buildVitalsData(form);
    if ("error" in built) {
      setError(built.error);
      return false;
    }

    if (Object.keys(built.data).length === 0) {
      setError(null);
      return true;
    }

    setIsLoading(true);
    setError(null);
    try {
      await vitalsService.create(nurse.nurse_id, patientId, {
        source,
        vitals_data: built.data,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vitals");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { recordVitals, isLoading, error };
}