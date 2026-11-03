from pydantic import BaseModel, field_validator
from enum import Enum
from datetime import datetime


class Source(str, Enum):
    nursing_notes = "Nursing Notes"
    sbar = "SBAR"
    patient_register = "Patient Registration"
    patient_record = "Patient Record"


class VitalsRegister(BaseModel):
    source: Source
    # All values must be numeric. BP is split into bp_systolic / bp_diastolic
    # instead of the "120/80" string format.
    vitals_data: dict[str, float]

    @field_validator("vitals_data")
    @classmethod
    def values_must_be_numeric(cls, v: dict) -> dict:
        for key, value in v.items():
            if not isinstance(value, (int, float)):
                raise ValueError(
                    f"'{key}' must be a number (got {type(value).__name__}). "
                    f"Blood pressure should be sent as 'bp_systolic' and 'bp_diastolic'."
                )
        return v


class VitalsResponse(BaseModel):
    vital_id: str
    patient_id: str
    nurse_id: str
    source: str
    vitals_data: dict[str, float]
    recorded_at: datetime

    class Config:
        from_attributes = True