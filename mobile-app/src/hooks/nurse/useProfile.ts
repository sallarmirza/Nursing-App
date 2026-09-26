// display profile 
// src/hooks/useProfile.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { nurseService } from "../../services/nurse/nurseService";
import { NurseProfile } from "../../types/nurse";

// Scoped per nurse_id so switching accounts on one device can't show stale data
const cacheKey = (nurseId: string) => `profile_cache_${nurseId}`;

export default function useProfile() {
  const { nurse } = useAuth();
  const [data, setData] = useState<NurseProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false); // only true before any data (cached or live) exists
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }

    const key = cacheKey(nurse.nurse_id);

    // 1. Show cached data immediately, if any
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        setData(JSON.parse(cached));
      } else {
        setIsLoading(true); // nothing to show yet, so this is a real loading state
      }
    } catch {
      // Corrupt or unreadable cache entry; ignore and fall through to network
    }

    // 2. Refetch live, silently update, and refresh the cache
    try {
      const response = await nurseService.getProfile(nurse.nurse_id);
      setData(response);
      setIsOffline(false);
      setError(null);
      await AsyncStorage.setItem(key, JSON.stringify(response));
    } catch (err) {
      setData((prev) => {
        if (prev) {
          // Had cached data — treat this as offline, not a hard error
          setIsOffline(true);
          return prev;
        }
        // No cache and no network — this is a real error
        setError(err instanceof Error ? err.message : "Failed to load profile");
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [nurse]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return { data, isLoading, isOffline, error, refetch: fetchProfile };
}