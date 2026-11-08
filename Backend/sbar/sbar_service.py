from storage import DBManager
from sbar.sbar_schema import SBARHandoverRegister
from datetime import datetime
from typing import Any
import uuid

from db_model import SBAR as SBARModel, Patient


class Sbar:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_sbar_id():
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()
        return f"SBAR-{year}-{unique_part}"

    def create_sbar(self, nurse_id: str, patient_id: str, data: SBARHandoverRegister) -> dict[str, Any]:
        """Create a new SBAR handover note."""
        with self.db.get_session() as session:
            patient = (
                session.query(Patient)
                .filter(
                    Patient.patient_id == patient_id,
                    Patient.assigned_nurse_id == nurse_id,
                )
                .first()
            )
            if patient is None:
                raise ValueError(
                    "Patient does not exist or is not assigned to this nurse"
                )

            sbar_id = self.create_sbar_id()

            handover = SBARModel(
                sbar_id=sbar_id,
                patient_id=patient_id,
                nurse_id=nurse_id,
                situation=data.situation,
                background=data.background,
                assessment=data.assessment,
                recommendation=data.recommendation,
                current_iv_medications=data.current_iv_medications or {},
                nursing_interventions=data.nursing_interventions or {},
                soap_notes=data.soap_notes or {},
            )

            session.add(handover)
            session.commit()

            return {
                "message": "SBAR handover created successfully",
                "sbar_id": sbar_id
            }

    def show_sbar(self, nurse_id: str, patient_id: str, page: int = 1, limit: int = 20) -> dict[str, Any]:
        """List SBAR handovers for a patient by a nurse, paginated."""
        with self.db.get_session() as session:
            base_query = session.query(SBARModel).filter(
                SBARModel.nurse_id == nurse_id,
                SBARModel.patient_id == patient_id,
            )
            total = base_query.count()
            rows = (
                base_query
                .order_by(SBARModel.sbar_created_at.desc())
                .offset((page - 1) * limit)
                .limit(limit)
                .all()
            )

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "total": total,
                "page": page,
                "limit": limit,
                "handovers": [
                    {
                        "sbar_id": h.sbar_id,
                        "patient_id": h.patient_id,
                        "nurse_id": h.nurse_id,
                        "situation": h.situation,
                        "background": h.background,
                        "assessment": h.assessment,
                        "recommendation": h.recommendation,
                        "current_iv_medications": h.current_iv_medications,
                        "nursing_interventions": h.nursing_interventions,
                        "soap_notes": h.soap_notes,
                        "sbar_created_at": h.sbar_created_at,
                    }
                    for h in rows
                ],
            }

    def delete_sbar_by_nurse(self, nurse_id: str, patient_id: str, sbar_id: str) -> dict[str, Any]:
        """Delete SBAR by nurse."""
        with self.db.get_session() as session:
            handover = (
                session.query(SBARModel)
                .filter(
                    SBARModel.sbar_id == sbar_id,
                    SBARModel.nurse_id == nurse_id,
                    SBARModel.patient_id == patient_id,
                )
                .first()
            )

            if handover is None:
                raise ValueError(
                    "SBAR handover not found or does not belong "
                    "to this nurse/patient"
                )

            session.delete(handover)
            session.commit()

            return {
                "message": f"{sbar_id} deleted successfully",
                "status": True,
                "sbar_id": sbar_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }
