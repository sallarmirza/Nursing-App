// src/hooks/notes/useCreateNote.ts
import { useState } from "react";
import { notesService } from "../../services/notes/noteService";
import { NursingNoteCreateRequest } from "../../types/notes";
import { useAuth } from "../../context/AuthContext";

export default function useCreateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const createNote = async (
    patientId: string,
    data: NursingNoteCreateRequest
  ): Promise<string | null> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await notesService.createNote(nurse.nurse_id, patientId, data);
      return response.note_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createNote, isLoading, error };
}