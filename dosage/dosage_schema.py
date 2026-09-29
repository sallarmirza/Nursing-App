from pydantic import BaseModel,Field
from datetime import datetime
from typing import Optional



class DosageCalculatorRegister(BaseModel):
    patient_weight: float = Field(gt=0, le=250)
    medication: str
    dose_per_kg: float = Field(gt=0)
    dose_unit: str
    concentration_value: float = Field(gt=0)
    concentration_unit: str

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





