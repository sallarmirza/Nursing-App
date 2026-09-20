// src/types/notes.ts

export interface NursingNoteCreateRequest {
  patient_condition: string;
  conscious_level: string;
  glasgow_coma_score: number;
  pain_scale: number;
  nursing_interventions?: Record<string, boolean>;
}

export interface NursingNoteCreateResponse {
  message: string;
  note_id: string;
}

// Mirrors backend: schema/note_schema.py -> SoapRegister
export interface SoapCreateRequest {
  Subjective: string;
  Objective: string;
  Assessment: string;
  Plan: string;
}

// One entry inside NursingNote.soap_history
export interface SoapEntry {
  version: number;
  created_at: string;
  nurse_id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// POST /notes/{nurse_id}/{patient_id}/{note_id}/soap response
export interface SoapCreateResponse {
  message: string;
  note_id: string;
  version: number;
  soap: SoapEntry;
}

// One item from GET /notes/{nurse_id}/{patient_id}
export interface NursingNote {
  note_id: string;
  patient_id: string;
  nurse_id: string;
  patient_condition: string;
  conscious_level: string;
  glasgow_coma_score: number;
  pain_scale: number;
  // null for notes created before interventions were stored
  nursing_interventions: Record<string, boolean> | null;
  soap_history: SoapEntry[];
  notes_created_at: string;
}

export interface NursingNotesListResponse {
  patient_id: string;
  nurse_id: string;
  notes: NursingNote[];
}