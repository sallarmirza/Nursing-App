from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from typing import Optional


class DosageCalculatorRegister(BaseModel):
    patient_weight: float = Field(gt=0, le=250)
    medication: str
    dose_per_kg: float = Field(gt=0)
    dose_unit: str
    concentration_value: float = Field(gt=0)
    concentration_unit: str

    @model_validator(mode="after")
    def check_unit_consistency(self) -> "DosageCalculatorRegister":
        # concentration_unit must be "{dose_unit}/mL" so the division
        # required_dose / concentration_value yields mL correctly.
        # e.g. dose_unit="mg" → concentration_unit must be "mg/mL"
        expected = f"{self.dose_unit}/mL"
        if self.concentration_unit.lower() != expected.lower():
            raise ValueError(
                f"concentration_unit must be '{expected}' when dose_unit is "
                f"'{self.dose_unit}' (got '{self.concentration_unit}'). "
                f"Convert both to the same unit before submitting."
            )
        return self

class DosageResponse(BaseModel):
    dose_calc_id: str
    patient_id: str
    nurse_id: str
    patient_weight: float
    medication: str
    dose_per_kg: float
    dose_unit: str
    concentration_value: float
    concentration_unit: str
    dosage_created_at: datetime

    class Config:
        from_attributes = True


# --- Calculation / list responses ---

class DosageSimpleResponse(BaseModel):
    """Returned by the stateless /calculate endpoint."""
    medication: str
    patient_weight_kg: float
    required_dose: float
    dose_unit: str
    concentration: str
    volume_to_administer_ml: float

class DosagePatientResponse(DosageSimpleResponse):
    """Extends simple response with the saved record's IDs."""
    dose_calc_id: str
    patient_id: str
    nurse_id: str

class DosageListResponse(BaseModel):
    patient_id: str
    total: int
    page: int
    limit: int
    dosages: list[DosageResponse]

class DosageDeleteResponse(BaseModel):
    message: str
    status: bool
    dose_calc_id: str
    patient_id: str
    nurse_id: str





