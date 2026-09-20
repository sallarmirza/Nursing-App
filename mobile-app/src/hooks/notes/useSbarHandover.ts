// src/hooks/notes/useSbarHandover.ts
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sbarService } from "../../services/notes/sbarService";
import {
  SbarCreateResponse,
  SbarFormValues,
  SbarHandoverRequest,
} from "../../types/sbar";

const clean = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

// True when at least one of the four SBAR sections has text
export function hasSbarContent(form: SbarFormValues): boolean {
  return [
    form.situation,
    form.background,
    form.assessment,
    form.recommendation,
  ].some((section) => section.trim().length > 0);
}

function buildRequest(form: SbarFormValues): SbarHandoverRequest {
  const request: SbarHandoverRequest = {
    situation: clean(form.situation),
    background: clean(form.background),
    assessment: clean(form.assessment),
    recommendation: clean(form.recommendation),
  };

  if (form.medications.length > 0) {
    request.current_iv_medications = { medications: form.medications };
  }

  return request;
}

export function useSbarHandover() {
  const [result, setResult] = useState<SbarCreateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nurse } = useAuth();

  const submit = async (
    patientId: string,
    form: SbarFormValues
  ): Promise<boolean> => {
    if (!nurse) {
      setError("No nurse session found. Please log in again.");
      return false;
    }

    if (!hasSbarContent(form)) {
      setError("Fill in at least one SBAR section before submitting");
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await sbarService.create(
        nurse.nurse_id,
        patientId,
        buildRequest(form)
      );
      setResult(response);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit handover");
      setResult(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, submit, reset };
}