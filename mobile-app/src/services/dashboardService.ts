// src/services/dashboardService.ts
import { apiClient } from "./api/client";
import { DashboardResponse } from "../types/dashboard";

export const dashboardService = {
  get: async (nurseId: string): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>(
      `/dashboard/${nurseId}`
    );
    return response.data;
  },
};