// src/hooks/calculations/useDosageHistory.ts
// Fetches the paginated dosage calculation history for a patient.
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { dosageService } from "../../services/calculations/dosageService";
import { DosageRecord } from "../../types/calculations";

export default function useDosageHistory(patientId?: string) {
  const [dosages, setDosages] = useState<DosageRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchDosages = useCallback(async () => {
    if (!patientId || !nurse) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await dosageService.list(nurse.nurse_id, patientId);
      setDosages(response.dosages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dosage history");
      setDosages([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  useFocusEffect(
    useCallback(() => {
      fetchDosages();
    }, [fetchDosages])
  );

  return { dosages, total, isLoading, error, refetch: fetchDosages };
}
