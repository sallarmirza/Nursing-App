from storage import DBManager
from schema.note_schema import NursingNoteRegister, SoapRegister, NursingNotesResponse
from sqlalchemy import text
from datetime import datetime
import uuid
import json
from typing import Any

class Notes:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_note_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:8].upper()

        return f"NOTE-{year}-{unique}"

    def create_notes(
        self,
        nurse_id: str,
        patient_id: str,
        data: NursingNoteRegister
    ) -> dict[str, str]:

        session = self.db.get_session()

        try:
            query = text("""
                INSERT INTO nursing_notes (
                    note_id,
                    patient_id,
                    nurse_id,
                    patient_condition,
                    conscious_level,
                    glasgow_coma_score,
                    pain_scale,
                    soap_history
                )
                VALUES (
                    :note_id,
                    :patient_id,
                    :nurse_id,
                    :patient_condition,
                    :conscious_level,
                    :glasgow_coma_score,
                    :pain_scale,
                    :soap_history
                )
            """)

            note_id = self.create_note_id()

            session.execute(
                query,
                {
                    "note_id": note_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id,
                    "patient_condition": data.patient_condition,
                    "conscious_level": data.conscious_level,
                    "glasgow_coma_score": data.glasgow_coma_score,
                    "pain_scale": data.pain_scale,
                    "soap_history": json.dumps([]),
                }
            )

            session.commit()

            return {
                "message": "Nursing note created successfully",
                "note_id": note_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def register_soap(
        self,
        nurse_id: str,
        patient_id: str,
        note_id: str,
        data: SoapRegister
    ):

        session = self.db.get_session()

        try:
            query = text("""
                SELECT soap_history
                FROM nursing_notes
                WHERE note_id = :note_id
                  AND patient_id = :patient_id
                  AND nurse_id = :nurse_id
            """)

            result = session.execute(
                query,
                {
                    "note_id": note_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if result is None:
                raise ValueError(
                    "Nursing note not found or does not belong "
                    "to this nurse/patient"
                )

            soap_history = result[0] or []

            new_version = len(soap_history) + 1

            new_soap = {
                "version": new_version,
                "created_at": datetime.now().isoformat(),
                "nurse_id": nurse_id,
                "subjective": data.Subjective,
                "objective": data.Objective,
                "assessment": data.Assessment,
                "plan": data.Plan
            }

            soap_history.append(new_soap)

            update_query = text("""
                UPDATE nursing_notes
                SET soap_history = :soap_history
                WHERE note_id = :note_id
                  AND patient_id = :patient_id
                  AND nurse_id = :nurse_id
            """)

            session.execute(
                update_query,
                {
                    "soap_history": json.dumps(soap_history),
                    "note_id": note_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            session.commit()

            return {
                "message": "SOAP note saved successfully",
                "note_id": note_id,
                "version": new_version,
                "soap": new_soap
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def show_nursing_notes(
        self,
        nurse_id: str,
        patient_id: str
    ):
        """Show all nursing notes for a patient."""

        session = self.db.get_session()

        try:
            list_notes_query = text("""
                SELECT
                    note_id,
                    patient_id,
                    nurse_id,
                    patient_condition,
                    conscious_level,
                    glasgow_coma_score,
                    pain_scale,
                    soap_history,
                    notes_created_at
                FROM nursing_notes
                WHERE nurse_id = :nurse_id
                AND patient_id = :patient_id
                ORDER BY notes_created_at DESC
            """)

            result = session.execute(
                list_notes_query,
                {
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )

            notes = result.mappings().all()

            if not notes:
                return {
                    "message": "No nursing notes found",
                    "patient_id": patient_id,
                    "notes": []
                }

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "notes": notes
            }

        except Exception:
            raise

        finally:
            session.close()

    def delete_notes(self, nurse_id: str, patient_id: str, note_id: str) -> dict[str, Any]:
        """Deleting notes for patient by nurse"""
        session = self.db.get_session()
        try:
            delete_query = text("""
                DELETE FROM nursing_notes
                WHERE note_id = :note_id
                AND nurse_id = :nurse_id
                AND patient_id = :patient_id
            """)
            result = session.execute(
                delete_query,
                {
                    "note_id": note_id,
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )
            if result.rowcount == 0:
                raise ValueError(
                    "Nursing note not found or does not belong "
                    "to this nurse/patient"
                )
            session.commit()
            return {
                "message": f"{note_id} deleted successfully",
                "status": True,
                "note_id": note_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()