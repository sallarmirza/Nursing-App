// src/services/patients/patientService.ts
import { apiClient } from "../api/client";
import {
  PatientCreateRequest,
  PatientCreateResponse,
  PatientListItem,
  PatientDetail,
} from "../../types/patient";

export const patientService = {
  create: async (
    nurseId: string,
    data: PatientCreateRequest
  ): Promise<PatientCreateResponse> => {
    const response = await apiClient.post<PatientCreateResponse>(
      `/patient/create/${nurseId}`,
      data
    );
    return response.data;
  },

  listAll: async (nurseId: string): Promise<PatientListItem[]> => {
    const response = await apiClient.get<PatientListItem[]>(
      `/patient/${nurseId}/all`
    );
    return response.data;
  },

  getById: async (
    nurseId: string,
    patientId: string
  ): Promise<PatientDetail> => {
    const response = await apiClient.get<PatientDetail>(
      `/patient/view/${nurseId}/${patientId}`
    );
    return response.data;
  },
};