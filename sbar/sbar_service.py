from storage import DBManager
from schema.register_schema import SBARHandoverRegister
from datetime import datetime
from typing import Any
import uuid

from db_model import SBAR as SBARModel  

class Sbar:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_sbar_id():
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()
        return f"SBAR-{year}-{unique_part}"

    def create_sbar(
        self,
        nurse_id: str,
        patient_id: str,
        data: SBARHandoverRegister
    ) -> dict[str, Any]:
        """Create a new SBAR handover note."""

        session = self.db.get_session()

        try:
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

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def show_sbar(
        self,
        nurse_id: str,
        patient_id: str
    ) -> dict[str, Any]:
        """List all SBAR handovers for a patient recorded by a given nurse."""

        session = self.db.get_session()

        try:
            rows = (
                session.query(SBARModel)
                .filter(
                    SBARModel.nurse_id == nurse_id,
                    SBARModel.patient_id == patient_id,
                )
                .order_by(SBARModel.sbar_created_at.desc())
                .all()
            )

            if not rows:
                return {
                    "message": "No SBAR handovers found",
                    "patient_id": patient_id,
                    "handovers": []
                }

            handovers = [
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
            ]

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "handovers": handovers
            }

        finally:
            session.close()

    def delete_sbar_by_nurse(self, nurse_id: str, patient_id: str, sbar_id: str) -> dict[str, Any]:
        """Delete sbar by nurse"""
        session = self.db.get_session()

        try:
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

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()