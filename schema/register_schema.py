from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any, List
from datetime import date
from enum import Enum
from datetime import datetime


class SBARHandoverRegister(BaseModel):
    situation: Optional[str] = None
    background: Optional[str] = None
    assessment: Optional[str] = None
    recommendation: Optional[str] = None
    current_iv_medications: Optional[dict[str, Any]] = None
    nursing_interventions: Optional[dict[str, Any]] = None
    soap_notes: Optional[dict[str, Any]] = None


class CurrentMedicationRegister(BaseModel):
    med_name: str
    dose: float = Field(gt=0)
    dose_unit: str
    frequency: str


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


class SBARResponse(BaseModel):
    sbar_id: str
    patient_id: str
    nurse_id: str
    situation: Optional[str] = None
    background: Optional[str] = None
    assessment: Optional[str] = None
    recommendation: Optional[str] = None
    current_iv_medications: Optional[dict[str, Any]] = {}
    nursing_interventions: Optional[dict[str, Any]] = {}
    soap_notes: Optional[dict[str, Any]] = {}
    sbar_created_at: datetime

    class Config:
        from_attributes = True


