// src/hooks/calculations/useDripCalculator.ts
import { useState } from "react";
import { dripService } from "../../services/calculations/dripService";
import { DripCalculatorRequest, DripCalculatorResponse } from "../../types/calculations";

export function useDripCalculator() {
  const [result, setResult] = useState<DripCalculatorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (data: DripCalculatorRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dripService.calculateSimple(data);
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