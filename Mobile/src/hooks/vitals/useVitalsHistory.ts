// src/hooks/vitals/useVitalsHistory.ts
// Fetches the paginated vitals list for a patient, refreshing on screen focus.
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { vitalsService } from "../../services/vitals/vitalsService";
import { VitalsEntry } from "../../types/vital";

export default function useVitalsHistory(patientId?: string) {
  const [vitals, setVitals] = useState<VitalsEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchVitals = useCallback(async () => {
    if (!patientId || !nurse) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await vitalsService.list(nurse.nurse_id, patientId);
      setVitals(response.vitals);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vitals");
      setVitals([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  useFocusEffect(
    useCallback(() => {
      fetchVitals();
    }, [fetchVitals])
  );

  return { vitals, total, isLoading, error, refetch: fetchVitals };
}
