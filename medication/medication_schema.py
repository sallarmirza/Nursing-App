from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime


class CurrentMedicationRegister(BaseModel):
    med_name: str
    dose: float = Field(gt=0)
    dose_unit: str
    frequency: str




class MedicationResponse(BaseModel):
    med_id: str
    patient_id: str
    med_name: str
    dose: Optional[float] = None
    dose_unit: Optional[str] = None
    frequency: Optional[str] = None
    med_start_date: datetime

    class Config:
        from_attributes = True
