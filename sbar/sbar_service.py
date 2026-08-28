from storage import DBManager
from schema.register_schema import SBARHandoverRegister
from datetime import datetime
from typing import Any
import uuid
import json
from sqlalchemy import text


class Sbar:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_sbar_id():
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:8].upper()
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

            query = text("""
                INSERT INTO sbar_handovers (
                    sbar_id,
                    patient_id,
                    nurse_id,
                    situation,
                    background,
                    assessment,
                    recommendation,
                    current_iv_medications,
                    nursing_interventions,
                    soap_notes
                )
                VALUES (
                    :sbar_id,
                    :patient_id,
                    :nurse_id,
                    :situation,
                    :background,
                    :assessment,
                    :recommendation,
                    :current_iv_medications,
                    :nursing_interventions,
                    :soap_notes
                )
            """)

            session.execute(
                query,
                {
                    "sbar_id": sbar_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id,
                    "situation": data.situation,
                    "background": data.background,
                    "assessment": data.assessment,
                    "recommendation": data.recommendation,
                    "current_iv_medications": json.dumps(data.current_iv_medications or {}),
                    "nursing_interventions": json.dumps(data.nursing_interventions or {}),
                    "soap_notes": json.dumps(data.soap_notes or {}),
                }
            )

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
            query = text("""
                SELECT
                    sbar_id,
                    patient_id,
                    nurse_id,
                    situation,
                    background,
                    assessment,
                    recommendation,
                    current_iv_medications,
                    nursing_interventions,
                    soap_notes,
                    sbar_created_at
                FROM sbar_handovers
                WHERE nurse_id = :nurse_id
                  AND patient_id = :patient_id
                ORDER BY sbar_created_at DESC
            """)

            result = session.execute(
                query,
                {
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )

            handovers = result.mappings().all()

            if not handovers:
                return {
                    "message": "No SBAR handovers found",
                    "patient_id": patient_id,
                    "handovers": []
                }

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "handovers": handovers
            }

        except Exception:
            raise

        finally:
            session.close()

    def delete_sbar(
        self,
        nurse_id: str,
        patient_id: str,
        sbar_id: str
    ) -> dict[str, Any]:
        """Delete an SBAR handover."""

        session = self.db.get_session()

        try:
            delete_query = text("""
                DELETE FROM sbar_handovers
                WHERE sbar_id = :sbar_id
                  AND nurse_id = :nurse_id
                  AND patient_id = :patient_id
            """)

            result = session.execute(
                delete_query,
                {
                    "sbar_id": sbar_id,
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )

            if result.rowcount == 0:
                raise ValueError(
                    "SBAR handover not found or does not belong "
                    "to this nurse/patient"
                )

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