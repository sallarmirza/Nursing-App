// src/types/calculations.ts

export interface DosageCalculatorRequest {
  patient_weight: number;
  medication: string;
  dose_per_kg: number;
  dose_unit: string;
  concentration_value: number;
  concentration_unit: string;
}

export interface DosageCalculatorResponse {
  medication: string;
  patient_weight_kg: number;
  required_dose: number;
  dose_unit: string;
  concentration: string;
  volume_to_administer_ml: number;
}

export interface DripCalculatorRequest {
  total_volume: number;
  time_duration_min: number;
  drop_factor: number;
}


export interface DripCalculatorResponse {
  total_volume_ml: number;
  time_duration_min: number;
  drop_factor: number;
  drop_rate_gtt_min: number;
}

// src/types/calculations.ts

export interface DosageCalculatorRequest {
  patient_weight: number;
  medication: string;
  dose_per_kg: number;
  dose_unit: string;
  concentration_value: number;
  concentration_unit: string;
}

export interface DosageCalculatorResponse {
  medication: string;
  patient_weight_kg: number;
  required_dose: number;
  dose_unit: string;
  concentration: string;
  volume_to_administer_ml: number;
}

export interface DripCalculatorRequest {
  total_volume: number;
  time_duration_min: number;
  drop_factor: number;
}

export interface DripCalculatorResponse {
  total_volume_ml: number;
  time_duration_min: number;
  drop_factor: number;
  drop_rate_gtt_min: number;
}

// POST /calc/drip/{nurse_id}/{patient_id} response (calculated + saved)
export interface DripPatientCalculationResponse extends DripCalculatorResponse {
  drip_calc_id: string;
  patient_id: string;
  nurse_id: string;
}

// src/types/calculations.ts

export interface DosageCalculatorRequest {
  patient_weight: number;
  medication: string;
  dose_per_kg: number;
  dose_unit: string;
  concentration_value: number;
  concentration_unit: string;
}

export interface DosageCalculatorResponse {
  medication: string;
  patient_weight_kg: number;
  required_dose: number;
  dose_unit: string;
  concentration: string;
  volume_to_administer_ml: number;
}

// POST /calc/dose/{nurse_id}/{patient_id} response (calculated + saved).
// Extra saved-record fields are optional because the ID field name is unconfirmed.
export interface DosagePatientCalculationResponse
  extends DosageCalculatorResponse {
  patient_id?: string;
  nurse_id?: string;
}

export interface DripCalculatorRequest {
  total_volume: number;
  time_duration_min: number;
  drop_factor: number;
}

export interface DripCalculatorResponse {
  total_volume_ml: number;
  time_duration_min: number;
  drop_factor: number;
  drop_rate_gtt_min: number;
}

// POST /calc/drip/{nurse_id}/{patient_id} response (calculated + saved)
export interface DripPatientCalculationResponse extends DripCalculatorResponse {
  drip_calc_id: string;
  patient_id: string;
  nurse_id: string;
}