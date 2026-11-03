from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class SBARHandoverRegister(BaseModel):
    situation: Optional[str] = None
    background: Optional[str] = None
    assessment: Optional[str] = None
    recommendation: Optional[str] = None
    current_iv_medications: Optional[dict[str, Any]] = None
    nursing_interventions: Optional[dict[str, bool]] = None
    soap_notes: Optional[dict[str, Any]] = None



class SBARResponse(BaseModel):
    sbar_id: str
    patient_id: str
    nurse_id: str
    situation: Optional[str] = None
    background: Optional[str] = None
    assessment: Optional[str] = None
    recommendation: Optional[str] = None
    current_iv_medications: Optional[dict[str, Any]] = {}
    nursing_interventions: Optional[dict[str, bool]] = {}
    soap_notes: Optional[dict[str, Any]] = {}
    sbar_created_at: datetime

    class Config:
        from_attributes = True


