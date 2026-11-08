// src/hooks/notes/useSbarHistory.ts
// Fetches the paginated SBAR handover list for a patient, refreshing on screen focus.
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sbarService } from "../../services/notes/sbarService";
import { SbarRecord } from "../../types/sbar";

export default function useSbarHistory(patientId?: string) {
  const [handovers, setHandovers] = useState<SbarRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchHandovers = useCallback(async () => {
    if (!patientId || !nurse) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await sbarService.list(nurse.nurse_id, patientId);
      setHandovers(response.handovers);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load handovers");
      setHandovers([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  useFocusEffect(
    useCallback(() => {
      fetchHandovers();
    }, [fetchHandovers])
  );

  return { handovers, total, isLoading, error, refetch: fetchHandovers };
}
