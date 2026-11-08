// src/types/vitals.ts

// Mirrors backend: schema/register_schema.py -> Source enum values
export type VitalsSource =
  | "Nursing Notes"
  | "SBAR"
  | "Patient Registration"
  | "Patient Record";

export type VitalsData = Record<string, number>;

// Mirrors backend: VitalsRegister
export interface VitalsCreateRequest {
  source: VitalsSource;
  vitals_data: VitalsData;
}

// POST /vitals/{nurse_id}/{patient_id} response
export interface VitalsCreateResponse {
  message: string;
  vital_id: string;
  patient_id: string;
  nurse_id: string;
  source: string;
  vitals_data: VitalsData;
}

// Vitals record as returned in lists / nested in patient view
export interface VitalsEntry {
  vital_id: string;
  patient_id: string;
  nurse_id: string;
  source: string;
  vitals_data: VitalsData;
  recorded_at: string;
}

// GET /vitals/{nurse_id}/{patient_id} response
export interface VitalsListResponse {
  patient_id: string;
  nurse_id: string;
  total: number;
  page: number;
  limit: number;
  vitals: VitalsEntry[];
}

// Raw form values as held by a screen (strings until parsed on submit)
export interface VitalsFormValues {
  bp: string;
  hr: string;
  rr: string;
  spO2: string;
  temp: string;
}