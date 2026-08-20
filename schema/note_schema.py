from pydantic import BaseModel, Field
from typing import Optional

class NursingNoteRegister(BaseModel):
    patient_condition: str
    conscious_level: str
    glasgow_coma_score: int = Field(ge=3, le=15)
    pain_scale: int = Field(ge=0, le=10)

class NursingNotesResponse(BaseModel):
    conscious_level: str
    glasgow_coma_score: int = Field(ge=3, le=15)
    pain_scale: int = Field(ge=0, le=10)
    Subjective: str
    Objective: str
    Assessment: str
    Plan: str

class SoapRegister(BaseModel):
    Subjective: str
    Objective: str
    Assessment: str
    Plan: str