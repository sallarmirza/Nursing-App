// src/services/notes/sbarService.ts
import { apiClient } from "../api/client";
import { SbarCreateResponse, SbarHandoverRequest, SbarListResponse } from "../../types/sbar";

export const sbarService = {
  create: async (
    nurseId: string,
    patientId: string,
    data: SbarHandoverRequest
  ): Promise<SbarCreateResponse> => {
    const response = await apiClient.post<SbarCreateResponse>(
      `/sbar/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },

  list: async (
    nurseId: string,
    patientId: string,
    page = 1,
    limit = 20
  ): Promise<SbarListResponse> => {
    const response = await apiClient.get<SbarListResponse>(
      `/sbar/${nurseId}/${patientId}`,
      { params: { page, limit } }
    );
    return response.data;
  },
};