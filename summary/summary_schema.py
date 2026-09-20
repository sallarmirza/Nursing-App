# summary/schema.py
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class DashboardPatient(BaseModel):
    patient_id: str
    patient_name: str
    last_vitals_at: Optional[datetime] = None
    vitals_status: Literal["updated", "overdue", "none"]


class DashboardResponse(BaseModel):
    nurse_id: str
    nurse_name: Optional[str] = None
    patients: list[DashboardPatient]