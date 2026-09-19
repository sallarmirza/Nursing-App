// src/services/auth/authService.ts
import { apiClient } from "../api/client";
import {
  NurseSignUpRequest,
  NurseSignUpResponse,
  NurseSignInRequest,
  NurseSignInResponse,
  NurseProfileSetupRequest,
  NurseProfileSetupResponse,
} from "../../types/auth";

export const authService = {
  signup: async (data: NurseSignUpRequest): Promise<NurseSignUpResponse> => {
    const response = await apiClient.post<NurseSignUpResponse>(
      "/nurse/signup",
      data
    );
    return response.data;
  },

  login: async (data: NurseSignInRequest): Promise<NurseSignInResponse> => {
    const response = await apiClient.post<NurseSignInResponse>(
      "/nurse/login",
      data
    );
    return response.data;
  },

  setupProfile: async (
    nurseId: string,
    data: NurseProfileSetupRequest
  ): Promise<NurseProfileSetupResponse> => {
    const response = await apiClient.post<NurseProfileSetupResponse>(
      `/nurse/setup/${nurseId}`,
      data
    );
    return response.data;
  },
};