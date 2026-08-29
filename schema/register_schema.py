from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any
from datetime import date
from enum import Enum


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class PatientRegister(BaseModel):
    patient_name: str = Field(min_length=2, max_length=100)
    gender: Gender
    date_of_birth: Optional[date] = None
    patient_weight: Optional[float] = Field(default=None, gt=0, le=250)
    patient_height: Optional[float] = Field(default=None, gt=0, le=250)
    patient_blood_group: Optional[BloodGroup] = None
    patient_ward: Optional[str] = None


class DosageCalculatorRegister(BaseModel):
    patient_weight: float = Field(gt=0, le=250)
    medication: str
    dose_per_kg: float = Field(gt=0)
    dose_unit: str
    concentration_value: float = Field(gt=0)
    concentration_unit: str


class DripCalculationRegister(BaseModel):
    total_volume: float = Field(gt=0)
    time_duration_min: float = Field(gt=0)
    drop_factor: float = Field(gt=0)


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