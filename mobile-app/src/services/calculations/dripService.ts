// src/services/calculations/dripService.ts
import { apiClient } from "../api/client";
import { DripCalculatorRequest, DripCalculatorResponse } from "../../types/calculations";

export const dripService = {
  
  calculateSimple: async (
    data: DripCalculatorRequest
  ): Promise<DripCalculatorResponse> => {
    const response = await apiClient.post<DripCalculatorResponse>(
      "/calc/drip/calculate",
      data
    );
    return response.data;
  },
};