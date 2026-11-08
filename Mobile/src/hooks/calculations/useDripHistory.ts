// src/hooks/calculations/useDripHistory.ts
// Fetches the paginated IV drip calculation history for a patient.
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { dripService } from "../../services/calculations/dripService";
import { DripRecord } from "../../types/calculations";

export default function useDripHistory(patientId?: string) {
  const [drips, setDrips] = useState<DripRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchDrips = useCallback(async () => {
    if (!patientId || !nurse) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await dripService.list(nurse.nurse_id, patientId);
      setDrips(response.drips);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drip history");
      setDrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  useFocusEffect(
    useCallback(() => {
      fetchDrips();
    }, [fetchDrips])
  );

  return { drips, total, isLoading, error, refetch: fetchDrips };
}
