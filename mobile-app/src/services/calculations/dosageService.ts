// src/services/calculations/dosageService.ts
import { apiClient } from "../api/client";
import {
  DosageCalculatorRequest,
  DosageCalculatorResponse,
  DosagePatientCalculationResponse,
} from "../../types/calculations";

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

  calculateForPatient: async (
    nurseId: string,
    patientId: string,
    data: DosageCalculatorRequest
  ): Promise<DosagePatientCalculationResponse> => {
    const response = await apiClient.post<DosagePatientCalculationResponse>(
      `/calc/dose/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },
};