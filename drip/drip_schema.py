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