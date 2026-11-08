// src/services/vitals/vitalsService.ts
import { apiClient } from "../api/client";
import {
  VitalsCreateRequest,
  VitalsCreateResponse,
} from "../../types/vital";

export const vitalsService = {
  create: async (
    nurseId: string,
    patientId: string,
    data: VitalsCreateRequest
  ): Promise<VitalsCreateResponse> => {
    const response = await apiClient.post<VitalsCreateResponse>(
      `/vitals/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },
};