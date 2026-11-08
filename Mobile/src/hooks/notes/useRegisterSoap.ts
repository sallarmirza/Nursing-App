// src/hooks/notes/useRegisterSoap.ts
import { useState } from "react";
import { notesService } from "../../services/notes/noteService";
import { SoapCreateRequest } from "../../types/notes";
import { useAuth } from "../../context/AuthContext";

export default function useRegisterSoap() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const registerSoap = async (
    patientId: string,
    noteId: string,
    data: SoapCreateRequest
  ): Promise<boolean> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      await notesService.registerSoap(nurse.nurse_id, patientId, noteId, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save SOAP note");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerSoap, isLoading, error };
}