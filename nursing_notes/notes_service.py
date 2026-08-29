from storage import DBManager
from schema.note_schema import NursingNoteRegister, SoapRegister, NursingNotesResponse
from datetime import datetime
import uuid
from typing import Any

from db_model import NursingNote


class Notes:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_note_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:12].upper()

        return f"NOTE-{year}-{unique}"

    def create_notes(self, nurse_id: str, patient_id: str, data: NursingNoteRegister) -> dict[str, str]:
        """create notes by nurse for the patient"""
        session = self.db.get_session()

        try:
            note_id = self.create_note_id()

            note = NursingNote(
                note_id=note_id,
                patient_id=patient_id,
                nurse_id=nurse_id,
                patient_condition=data.patient_condition,
                conscious_level=data.conscious_level,
                glasgow_coma_score=data.glasgow_coma_score,
                pain_scale=data.pain_scale,
                soap_history=[],
            )

            session.add(note)
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

    def register_soap(self, nurse_id: str, patient_id: str, note_id: str, data: SoapRegister) -> dict[str, Any]:
        """register soap and save it into json"""
        session = self.db.get_session()

        try:
            note = (
                session.query(NursingNote)
                .filter(
                    NursingNote.note_id == note_id,
                    NursingNote.patient_id == patient_id,
                    NursingNote.nurse_id == nurse_id,
                )
                .first()
            )

            if note is None:
                raise ValueError(
                    "Nursing note not found or does not belong "
                    "to this nurse/patient"
                )

            soap_history = list(note.soap_history) if note.soap_history else []

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

            # Reassign (not in-place append) so SQLAlchemy detects the change
            note.soap_history = soap_history

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

    def show_nursing_notes(self, nurse_id: str, patient_id: str):
        """Show all nursing notes for a patient."""

        session = self.db.get_session()

        try:
            rows = (
                session.query(NursingNote)
                .filter(
                    NursingNote.nurse_id == nurse_id,
                    NursingNote.patient_id == patient_id,
                )
                .order_by(NursingNote.notes_created_at.desc())
                .all()
            )

            if not rows:
                return {
                    "message": "No nursing notes found",
                    "patient_id": patient_id,
                    "notes": []
                }

            notes = [
                {
                    "note_id": n.note_id,
                    "patient_id": n.patient_id,
                    "nurse_id": n.nurse_id,
                    "patient_condition": n.patient_condition,
                    "conscious_level": n.conscious_level,
                    "glasgow_coma_score": n.glasgow_coma_score,
                    "pain_scale": n.pain_scale,
                    "soap_history": n.soap_history,
                    "notes_created_at": n.notes_created_at,
                }
                for n in rows
            ]

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "notes": notes
            }

        finally:
            session.close()

    def delete_notes(self, nurse_id: str, patient_id: str, note_id: str) -> dict[str, Any]:
        """Deleting notes for patient by nurse"""
        session = self.db.get_session()
        try:
            note = (
                session.query(NursingNote)
                .filter(
                    NursingNote.note_id == note_id,
                    NursingNote.nurse_id == nurse_id,
                    NursingNote.patient_id == patient_id,
                )
                .first()
            )

            if note is None:
                raise ValueError(
                    "Nursing note not found or does not belong "
                    "to this nurse/patient"
                )

            session.delete(note)
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