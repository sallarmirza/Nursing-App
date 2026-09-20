# summary/service.py
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import func

from db_model import Nurse, Patient, Vitals

# Tune to your ward policy
VITALS_OVERDUE_HOURS = 4
RECENT_PATIENT_LIMIT = 5


class DashboardService:

    def __init__(self, db):
        self.db = db

    @staticmethod
    def _vitals_status(last_vitals_at: datetime | None, now: datetime) -> str:
        if last_vitals_at is None:
            return "none"
        if now - last_vitals_at > timedelta(hours=VITALS_OVERDUE_HOURS):
            return "overdue"
        return "updated"

    def get_dashboard(self, nurse_id: str) -> dict[str, Any]:
        session = self.db.get_session()

        try:
            nurse = (
                session.query(Nurse)
                .filter(Nurse.nurse_id == nurse_id)
                .first()
            )

            if nurse is None:
                raise ValueError("Nurse not found")

            # nurse_id scoping: only this nurse's assigned patients
            patients = (
                session.query(Patient)
                .filter(Patient.assigned_nurse_id == nurse_id)
                .order_by(Patient.patient_created_at.desc())
                .limit(RECENT_PATIENT_LIMIT)
                .all()
            )

            patient_ids = [p.patient_id for p in patients]

            # Latest vitals per patient, patient-scoped across all nurses
            last_vitals: dict[str, datetime] = {}
            if patient_ids:
                rows = (
                    session.query(Vitals.patient_id, func.max(Vitals.recorded_at))
                    .filter(Vitals.patient_id.in_(patient_ids))
                    .group_by(Vitals.patient_id)
                    .all()
                )
                last_vitals = {pid: ts for pid, ts in rows}

            # current_timestamp in SQLite is UTC, so compare against UTC
            now = datetime.now(timezone.utc).replace(tzinfo=None)

            return {
                "nurse_id": nurse.nurse_id,
                "nurse_name": nurse.nurse_name,
                "patients": [
                    {
                        "patient_id": p.patient_id,
                        "patient_name": p.patient_name,
                        "last_vitals_at": last_vitals.get(p.patient_id),
                        "vitals_status": self._vitals_status(
                            last_vitals.get(p.patient_id), now
                        ),
                    }
                    for p in patients
                ],
            }

        finally:
            session.close()