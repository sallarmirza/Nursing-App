// src/services/notes/noteService.ts
// NOTE: filename must be noteService.ts to match the hook imports
import { apiClient } from "../api/client";
import {
  NursingNoteCreateRequest,
  NursingNoteCreateResponse,
  NursingNotesListResponse,
  SoapCreateRequest,
  SoapCreateResponse,
} from "../../types/notes";

export const notesService = {
  createNote: async (
    nurseId: string,
    patientId: string,
    data: NursingNoteCreateRequest
  ): Promise<NursingNoteCreateResponse> => {
    const response = await apiClient.post<NursingNoteCreateResponse>(
      `/notes/${nurseId}/${patientId}`,
      data
    );
    return response.data;
  },

  registerSoap: async (
    nurseId: string,
    patientId: string,
    noteId: string,
    data: SoapCreateRequest
  ): Promise<SoapCreateResponse> => {
    const response = await apiClient.post<SoapCreateResponse>(
      `/notes/${nurseId}/${patientId}/${noteId}/soap`,
      data
    );
    return response.data;
  },

  getNotes: async (
    nurseId: string,
    patientId: string
  ): Promise<NursingNotesListResponse> => {
    const response = await apiClient.get<NursingNotesListResponse>(
      `/notes/${nurseId}/${patientId}`
    );
    return response.data;
  },
};