// src/types/sbar.ts

export interface SbarIvMedication {
  name: string;
  dose: string;
  frequency?: string;
}

export interface SbarHandoverRequest {
  situation?: string;
  background?: string;
  assessment?: string;
  recommendation?: string;
  current_iv_medications?: { medications: SbarIvMedication[] };
  nursing_interventions?: Record<string, unknown>;
  soap_notes?: Record<string, unknown>;
}

export interface SbarCreateResponse {
  message: string;
  sbar_id: string;
}

// SBAR record as returned in lists / nested in patient view
export interface SbarRecord {
  sbar_id: string;
  patient_id: string;
  nurse_id: string;
  situation: string | null;
  background: string | null;
  assessment: string | null;
  recommendation: string | null;
  current_iv_medications: Record<string, unknown> | null;
  nursing_interventions: Record<string, boolean> | null;
  soap_notes: Record<string, unknown> | null;
  sbar_created_at: string;
}

// Values the screen hands to the hook
export interface SbarFormValues {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  medications: SbarIvMedication[]; 
}