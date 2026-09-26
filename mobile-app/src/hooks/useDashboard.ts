// src/hooks/useDashboard.ts
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboard/dashboardService";
import { DashboardResponse } from "../types/dashboard";

export default function useDashboard() {
  const { nurse } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false); // first load only
  const [isRefreshing, setIsRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const fetchDashboard = useCallback(async () => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }

    // Spinner only before the first result; later refetches are silent
    if (!hasLoadedRef.current) setIsLoading(true);

    try {
      const response = await dashboardService.get(nurse.nurse_id);
      setData(response);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      // Keep the last good data on screen if a refetch fails
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [nurse]);

  // Refetch every time the dashboard tab gains focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboard();
    setIsRefreshing(false);
  }, [fetchDashboard]);

  return { data, isLoading, isRefreshing, error, refresh };
}