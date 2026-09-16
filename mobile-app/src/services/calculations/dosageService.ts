// src/services/calculations/dosageService.ts
import { apiClient } from "../api/client";
import { DosageCalculatorRequest, DosageCalculatorResponse } from "../../types/calculations";

export const dosageService = {
  calculateSimple: async (
    data: DosageCalculatorRequest
  ): Promise<DosageCalculatorResponse> => {
    const response = await apiClient.post<DosageCalculatorResponse>(
      "/calc/dose/calculate",
      data
    );
    return response.data;
  },
};