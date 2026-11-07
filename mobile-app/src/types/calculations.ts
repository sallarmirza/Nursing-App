// src/types/calculations.ts

// --- Dosage ---

export interface DosageCalculatorRequest {
  patient_weight: number;
  medication: string;
  dose_per_kg: number;
  dose_unit: string;
  concentration_value: number;
  concentration_unit: string;
}

// POST /calc/dose/calculate response (stateless, not saved)
export interface DosageCalculatorResponse {
  medication: string;
  patient_weight_kg: number;
  required_dose: number;
  dose_unit: string;
  concentration: string;
  volume_to_administer_ml: number;
}

// POST /calc/dose/{nurse_id}/{patient_id} response (calculated and saved)
export interface DosagePatientCalculationResponse extends DosageCalculatorResponse {
  dose_calc_id: string;
  patient_id: string;
  nurse_id: string;
}

// Saved dosage record shape (GET list / nested in patient view)
export interface DosageRecord {
  dose_calc_id: string;
  patient_id: string;
  nurse_id: string;
  patient_weight: number;
  medication: string;
  dose_per_kg: number;
  dose_unit: string;
  concentration_value: number;
  concentration_unit: string;
  dosage_created_at: string;
}

// --- IV Drip ---

export interface DripCalculatorRequest {
  total_volume: number;
  time_duration_min: number;
  drop_factor: number;
}

// POST /calc/drip/calculate response (stateless, not saved)
export interface DripCalculatorResponse {
  total_volume_ml: number;
  time_duration_min: number;
  drop_factor: number;
  drop_rate_gtt_min: number;
}

// POST /calc/drip/{nurse_id}/{patient_id} response (calculated and saved)
export interface DripPatientCalculationResponse extends DripCalculatorResponse {
  drip_calc_id: string;
  patient_id: string;
  nurse_id: string;
}

// Saved drip record shape (GET list / nested in patient view)
export interface DripRecord {
  drip_calc_id: string;
  patient_id: string;
  nurse_id: string;
  total_volume_ml: number;
  time_duration_min: number;
  drop_factor: number | null;
  drop_per_min: number | null;
  created_at: string;
}
