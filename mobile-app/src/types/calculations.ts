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