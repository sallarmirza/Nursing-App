// src/services/notes/sbarService.ts
import { apiClient } from "../api/client";
import { SbarCreateResponse, SbarHandoverRequest } from "../../types/sbar";

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
};