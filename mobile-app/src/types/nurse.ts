// src/types/nurse.ts
export interface NurseProfile {
  nurse_id: string;
  nurse_name: string | null;
  nurse_email: string;
  nurse_qualification: string | null;
  nurse_designation: string | null;
  nurse_hospital: string | null;
  nurse_experience: number | null;
}