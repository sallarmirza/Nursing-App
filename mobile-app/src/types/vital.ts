// src/types/vitals.ts

// Mirrors backend: schema/register_schema.py -> Source enum values
export type VitalsSource =
  | "Nursing Notes"
  | "SBAR"
  | "Patient Registration"
  | "Patient Record";

export type VitalsData = Record<string, string | number>;

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

// Raw form values as held by a screen (strings only)
export interface VitalsFormValues {
  bp: string;
  hr: string;
  rr: string;
  spO2: string;
  temp: string;
}