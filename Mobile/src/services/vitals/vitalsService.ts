// src/services/vitals/vitalsService.ts
import { apiClient } from "../api/client";
import {
  VitalsCreateRequest,
  VitalsCreateResponse,
  VitalsListResponse,
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

  list: async (
    nurseId: string,
    patientId: string,
    page = 1,
    limit = 20
  ): Promise<VitalsListResponse> => {
    const response = await apiClient.get<VitalsListResponse>(
      `/vitals/${nurseId}/${patientId}`,
      { params: { page, limit } }
    );
    return response.data;
  },
};