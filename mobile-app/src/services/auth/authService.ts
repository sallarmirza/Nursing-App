// src/services/auth/authService.ts
import { apiClient } from "../api/client";
import {
  NurseSignUpRequest,
  NurseSignUpResponse,
  NurseSignInRequest,
  NurseSignInResponse,
  NurseProfileSetupRequest,
  NurseProfileSetupResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  LogoutRequest,
  LogoutResponse,
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

  refresh: async (data: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post<TokenRefreshResponse>(
      "/nurse/refresh",
      data
    );
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(
      "/nurse/logout",
      data
    );
    return response.data;
  },
};