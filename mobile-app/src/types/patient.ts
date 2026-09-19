// src/types/patient.ts

export interface PatientCreateRequest {
  patient_first_name: string;
  patient_last_name: string;
  gender: "Male" | "Female" | "Other";
  date_of_birth?: string; // ISO date string, e.g. "1990-05-12"
  patient_weight?: number;
  patient_height?: number;
  patient_blood_group?: string; // e.g. "A+", "O-"
  patient_ward?: string;
}

export interface PatientCreateResponse {
  patient_id: string;
  message: string;
}

export interface PatientListItem {
  patient_id: string;
  patient_name: string;
  patient_gender: "Male" | "Female" | "Other";
  date_of_birth: string | null;
  patient_weight: number | null;
  patient_height: number | null;
  patient_blood_group: string | null;
  ward: string | null;
  assigned_nurse_id: string;
  patient_created_at: string;
}

export interface PatientDetail {
  patient_id: string;
  patient_name: string;
  patient_gender: "Male" | "Female" | "Other";
  date_of_birth: string | null;
  patient_weight: number | null;
  patient_height: number | null;
  patient_blood_group: string | null;
  patient_ward: string | null;
  vitals: unknown[];
  nursing_notes: unknown[];
  medications: unknown[];
  sbar_handovers: unknown[];
  dosage_calculations: unknown[];
  drip_calculations: unknown[];
}