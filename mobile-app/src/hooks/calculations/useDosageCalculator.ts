// src/hooks/calculations/useDosageCalculator.ts
import { useState } from "react";
import { dosageService } from "../../services/calculations/dosageService";
import { DosageCalculatorRequest, DosageCalculatorResponse } from "../../types/calculations";

export function useDosageCalculator() {
  const [result, setResult] = useState<DosageCalculatorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (data: DosageCalculatorRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dosageService.calculateSimple(data);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, calculate, reset };
}