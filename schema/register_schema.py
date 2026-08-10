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
    date_of_birth: date
    patient_weight: float = Field(gt=0, le=250)
    patient_height: float = Field(gt=0, le=250)
    patient_blood_group: BloodGroup
    patient_ward: Optional[str] = None
    patient_bed: Optional[str] = None





class DosageCalculatorRegister(BaseModel):
    nurse_id: Optional[str] = None
    patient_id: Optional[str] = None
    patient_weight: float = Field(gt=0, le=250)
    medication: str
    concentration_value: float = Field(gt=0)
    concentration_unit: str
    guideline: Optional[str] = None


class NursingNoteRegister(BaseModel):
    patient_id: Optional[str] = None
    nurse_id: Optional[str] = None
    patient_condition: str
    conscious_level: str
    glasgow_coma_score: int = Field(ge=3, le=15)
    pain_scale: int = Field(ge=0, le=10)


class IVDripCalculationRegister(BaseModel):
    patient_id: Optional[str] = None
    nurse_id: Optional[str] = None
    total_volume: float = Field(gt=0)
    time_duration_min: float = Field(gt=0)
    drop_factor: str
    drop_per_min: int = Field(gt=0)


class SBARHandoverRegister(BaseModel):
    nurse_id: Optional[str] = None
    patient_id: Optional[str] = None
    situation: Optional[str] = None
    background: Optional[str] = None
    assessment: Optional[str] = None
    recommendation: Optional[str] = None
    current_iv_medications: Optional[dict[str, Any]] = None
    nursing_interventions: Optional[dict[str, Any]] = None
    soap_notes: Optional[dict[str, Any]] = None


class CurrentMedicationRegister(BaseModel):
    patient_id: str
    med_name: str
    dose: float = Field(gt=0)
    dose_unit: str
    frequency: str


class VitalsRegister(BaseModel):
    patient_id: Optional[str] = None
    nurse_id: Optional[str] = None
    source: str
    vitals_data: dict[str, Any]