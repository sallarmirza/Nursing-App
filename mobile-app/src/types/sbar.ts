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

// Values the screen hands to the hook
export interface SbarFormValues {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  medications: SbarIvMedication[]; 
}