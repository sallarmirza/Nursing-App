from pydantic import BaseModel,Field,field_validator
from enum import Enum
from typing import Optional,List
from datetime import date
from schema.register_schema import VitalsResponse,MedicationResponse,SBARResponse
from schema.calculation_schema import DripResponse,DosageResponse
from schema.note_schema import NursingNotesResponse

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
    patient_first_name: str = Field(min_length=2, max_length=100)
    patient_last_name:str=Field(min_length=2,max_length=100)
    gender: Gender
    date_of_birth: Optional[date] = None
    patient_weight: Optional[float] = Field(default=None, gt=0, le=250)
    patient_height: Optional[float] = Field(default=None, gt=0, le=250)
    patient_blood_group: Optional[BloodGroup] = None
    patient_ward: Optional[str] = None
    
    @field_validator("patient_first_name","patient_last_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()
    
class PatientResponse(BaseModel):
    patient_id:str
    patient_name:str
    patient_gender:Gender    
    date_of_birth: Optional[date] = None
    patient_weight: Optional[float] = Field(default=None, gt=0, le=250)
    patient_height: Optional[float] = Field(default=None, gt=0, le=250)
    patient_blood_group: Optional[BloodGroup] = None
    patient_ward: Optional[str] = None
    
    vitals: List[VitalsResponse] = []
    nursing_notes: List[NursingNotesResponse] = []
    medications: List[MedicationResponse] = []
    sbar_handovers: List[SBARResponse] = []
    dosage_calculations: List[DosageResponse] = []
    drip_calculations: List[DripResponse] = []
    
    class config:
        from_attributes=True
