// src/types/medications.ts

// Mirrors backend: CurrentMedicationRegister
export interface MedicationCreateRequest {
  med_name: string;
  dose: number;
  dose_unit: string;
  frequency: string;
}

// POST /medications/{nurse_id}/{patient_id} response
export interface MedicationCreateResponse {
  status: boolean;
  message: string;
  med_id: string;
  patient_id: string;
  nurse_id: string;
  med_name: string;
  dose: number;
  dose_unit: string;
  frequency: string;
}

// One item from GET /medications/{nurse_id}/{patient_id}
export interface Medication {
  med_id: string;
  patient_id: string;
  med_name: string;
  dose: number | null;
  dose_unit: string | null;
  frequency: string | null;
  med_start_date: string;
}

// nurse_id is absent when the patient has no medications
export interface MedicationListResponse {
  status: boolean;
  message?: string;
  patient_id: string;
  nurse_id?: string;
  medications: Medication[];
}

export interface MedicationDeleteResponse {
  status: boolean;
  message: string;
  med_id: string;
  patient_id: string;
  nurse_id: string;
}

export interface MedicationFormValues {
  medName: string;
  dose: string;
  doseUnit: string;
  frequency: string;
}