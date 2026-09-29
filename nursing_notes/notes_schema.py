# schema/note_schema.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NursingNoteRegister(BaseModel):
    patient_condition: str
    conscious_level: str
    glasgow_coma_score: int = Field(ge=3, le=15)
    pain_scale: int = Field(ge=0, le=10)
    # checklist state: {"IV Fluids": true, "Oxygen Therapy": false, ...}
    nursing_interventions: dict[str, bool] = Field(default_factory=dict)

class SoapRegister(BaseModel):
    Subjective: str
    Objective: str
    Assessment: str
    Plan: str

class SoapEntry(BaseModel):
    version: int
    created_at: str
    nurse_id: str
    subjective: str
    objective: str
    assessment: str
    plan: str


class NursingNoteOut(BaseModel):
    note_id: str
    patient_id: str
    nurse_id: str
    patient_condition: str
    conscious_level: str
    glasgow_coma_score: int
    pain_scale: int
    # None for notes created before this column existed
    nursing_interventions: Optional[dict[str, bool]] = None
    soap_history: list[SoapEntry]
    notes_created_at: datetime

    class Config:
        from_attributes = True
        
class NursingNotesResponse(BaseModel):
    patient_id: str
    nurse_id: str
    notes: list[NursingNoteOut]