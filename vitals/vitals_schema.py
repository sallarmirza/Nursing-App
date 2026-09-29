from pydantic import BaseModel
from enum import Enum
from typing import Any
from datetime import datetime


class Source(str, Enum):
    nursing_notes = "Nursing Notes"
    sbar = "SBAR"
    patient_register = "Patient Registration"
    patient_record = "Patient Record"


class VitalsRegister(BaseModel):
    source: Source
    vitals_data: dict[str, Any]
    


class VitalsResponse(BaseModel):
    vital_id: str
    patient_id: str
    nurse_id: str
    source: str
    vitals_data: dict[str, Any]
    recorded_at: datetime

    class Config:
        from_attributes = True