from pydantic import BaseModel,Field
from datetime import datetime
from typing import Optional


class DripCalculationRegister(BaseModel):
    total_volume: float = Field(gt=0)
    time_duration_min: float = Field(gt=0)
    drop_factor: float = Field(gt=0)


class DripResponse(BaseModel):
    drip_calc_id: str
    patient_id: str
    nurse_id: str
    total_volume_ml: float
    time_duration_min: float
    drop_factor: Optional[float] = None
    drop_per_min: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Calculation / list responses ---

class DripSimpleResponse(BaseModel):
    """Returned by the stateless /calculate endpoint."""
    total_volume_ml: float
    time_duration_min: float
    drop_factor: float
    drop_rate_gtt_min: int

class DripPatientResponse(BaseModel):
    """Returned when a drip calculation is saved against a patient."""
    drip_calc_id: str
    patient_id: str
    nurse_id: str
    total_volume_ml: float
    time_duration_min: float
    drop_factor: float
    drop_rate_gtt_min: int

class DripListResponse(BaseModel):
    patient_id: str
    total: int
    page: int
    limit: int
    drips: list[DripResponse]

class DripDeleteResponse(BaseModel):
    message: str
    status: bool
    drip_calc_id: str
    patient_id: str
    nurse_id: str