// src/hooks/notes/useNotesHistory.ts
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { notesService } from "../../services/notes/noteService";
import { NursingNote } from "../../types/notes";

export default function useNotesHistory(patientId?: string) {
  const [notes, setNotes] = useState<NursingNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!patientId) return;

    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await notesService.getNotes(nurse.nurse_id, patientId);
      setNotes(response.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurse, patientId]);

  // Refetch every time the screen regains focus (e.g. after adding a SOAP)
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  return { notes, isLoading, error, refetch: fetchNotes };
}