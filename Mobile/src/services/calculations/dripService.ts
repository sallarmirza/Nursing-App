// src/services/calculations/dripService.ts
import { apiClient } from "../api/client";
import {
  DripCalculatorRequest,
  DripCalculatorResponse,
  DripListResponse,
  DripPatientCalculationResponse,
} from "../../types/calculations";

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

  calculateForPatient: async (
    nurseId: string,
    patientId: string,
    data: DripCalculatorRequest
  ): Promise<DripPatientCalculationResponse> => {
    const response = await apiClient.post<DripPatientCalculationResponse>(
      `/calc/drip/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },

  list: async (
    nurseId: string,
    patientId: string,
    page = 1,
    limit = 20
  ): Promise<DripListResponse> => {
    const response = await apiClient.get<DripListResponse>(
      `/calc/drip/${nurseId}/${patientId}`,
      { params: { page, limit } }
    );
    return response.data;
  },
};