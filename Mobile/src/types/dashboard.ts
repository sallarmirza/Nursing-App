// src/types/dashboard.ts

export type VitalsStatus = "updated" | "overdue" | "none";

export interface DashboardPatient {
  patient_id: string;
  patient_name: string;
  last_vitals_at: string | null;
  vitals_status: VitalsStatus;
}

// GET /dashboard/{nurse_id}
export interface DashboardResponse {
  nurse_id: string;
  nurse_name: string | null;
  patients: DashboardPatient[];
}