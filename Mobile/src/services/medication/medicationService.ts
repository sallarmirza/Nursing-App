// src/services/medications/medicationService.ts
import { apiClient } from "../api/client";
import {
  MedicationCreateRequest,
  MedicationCreateResponse,
  MedicationDeleteResponse,
  MedicationListResponse,
} from "../../types/medication";

export const medicationService = {
  list: async (
    nurseId: string,
    patientId: string
  ): Promise<MedicationListResponse> => {
    const response = await apiClient.get<MedicationListResponse>(
      `/medications/${nurseId}/${patientId}`
    );
    return response.data;
  },

  add: async (
    nurseId: string,
    patientId: string,
    data: MedicationCreateRequest
  ): Promise<MedicationCreateResponse> => {
    const response = await apiClient.post<MedicationCreateResponse>(
      `/medications/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },

  remove: async (
    nurseId: string,
    patientId: string,
    medId: string
  ): Promise<MedicationDeleteResponse> => {
    const response = await apiClient.delete<MedicationDeleteResponse>(
      `/medications/${nurseId}/${patientId}/${medId}`
    );
    return response.data;
  },
};