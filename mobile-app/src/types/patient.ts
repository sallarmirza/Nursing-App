// src/types/patient.ts
import { VitalsEntry } from "./vital";
import { NursingNote } from "./notes";
import { Medication } from "./medication";
import { SbarRecord } from "./sbar";
import { DosageRecord, DripRecord } from "./calculations";

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

export interface PatientDeleteResponse {
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
  vitals: VitalsEntry[];
  nursing_notes: NursingNote[];
  medications: Medication[];
  sbar_handovers: SbarRecord[];
  dosage_calculations: DosageRecord[];
  drip_calculations: DripRecord[];
}
