// src/services/nurseService.ts
import { apiClient } from "../api/client"; 
import { NurseProfile } from "../../types/nurse";

export const nurseService = {
  getProfile: async (nurseId: string): Promise<NurseProfile> => {
    const response = await apiClient.get<NurseProfile>(`/nurses/${nurseId}`);
    return response.data;
  },
};