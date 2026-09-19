// src/types/auth.ts

// POST /nurse/signup
export interface NurseSignUpRequest {
  nurse_email: string;
  nurse_password: string;
}
export interface NurseSignUpResponse {
  message: string;
  nurse_id: string;
}

// POST /nurse/login
export interface NurseSignInRequest {
  nurse_email: string;
  nurse_password: string;
}
export interface NurseSignInResponse {
  nurse_id: string;
  nurse_name: string | null;
  nurse_email: string;
}

// POST /nurse/setup/{nurse_id}
export interface NurseProfileSetupRequest {
  nurse_name: string;
  nurse_qualification?: string;
  nurse_designation?: string;
  nurse_hospital?: string;
  nurse_experience?: number;
}
export interface NurseProfileSetupResponse {
  message: string;
  nurse_id: string;
}