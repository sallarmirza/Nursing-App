# nursing_notes/notes_service.py
from storage import DBManager
from nursing_notes.notes_schema import NursingNoteRegister, SoapRegister, NursingNotesResponse
from datetime import datetime, timezone
import uuid
from typing import Any

from db_model import NursingNote, Patient


class Notes:
    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_note_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:12].upper()
        return f"NOTE-{year}-{unique}"

    @staticmethod
    def _assert_patient_assigned(session, nurse_id: str, patient_id: str) -> None:
        """Raise ValueError unless the patient exists and is assigned to this nurse."""
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

    def create_notes(self, nurse_id: str, patient_id: str, data: NursingNoteRegister) -> dict[str, str]:
        """Create notes by nurse for the patient."""
        with self.db.get_session() as session:
            self._assert_patient_assigned(session, nurse_id, patient_id)

            note_id = self.create_note_id()

            note = NursingNote(
                note_id=note_id,
                patient_id=patient_id,
                nurse_id=nurse_id,
                patient_condition=data.patient_condition,
                conscious_level=data.conscious_level,
                glasgow_coma_score=data.glasgow_coma_score,
                pain_scale=data.pain_scale,
                nursing_interventions=data.nursing_interventions or {},
                soap_history=[],
            )

            session.add(note)
            session.commit()

            return {
                "message": "Nursing note created successfully",
                "note_id": note_id
            }

    def register_soap(self, nurse_id: str, patient_id: str, note_id: str, data: SoapRegister) -> dict[str, Any]:
        """Register SOAP and append it to the note's json history."""
        with self.db.get_session() as session:
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
                "created_at": datetime.now(timezone.utc).isoformat(),
                "nurse_id": nurse_id,
                "subjective": data.subjective,
                "objective": data.objective,
                "assessment": data.assessment,
                "plan": data.plan,
            }

            soap_history.append(new_soap)
            # Reassign (not in-place) so SQLAlchemy detects the change on JSON column
            note.soap_history = soap_history

            session.commit()

            return {
                "message": "SOAP note saved successfully",
                "note_id": note_id,
                "version": new_version,
                "soap": new_soap
            }

    def show_nursing_notes(self, nurse_id: str, patient_id: str) -> dict[str, Any]:
        """Show all nursing notes for a patient."""
        with self.db.get_session() as session:
            rows = (
                session.query(NursingNote)
                .filter(
                    NursingNote.nurse_id == nurse_id,
                    NursingNote.patient_id == patient_id,
                )
                .order_by(NursingNote.notes_created_at.desc())
                .all()
            )

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "notes": [
                    {
                        "note_id": n.note_id,
                        "patient_id": n.patient_id,
                        "nurse_id": n.nurse_id,
                        "patient_condition": n.patient_condition,
                        "conscious_level": n.conscious_level,
                        "glasgow_coma_score": n.glasgow_coma_score,
                        "pain_scale": n.pain_scale,
                        "nursing_interventions": n.nursing_interventions or {},
                        "soap_history": n.soap_history,
                        "notes_created_at": n.notes_created_at,
                    }
                    for n in rows
                ],
            }

    def delete_notes(self, nurse_id: str, patient_id: str, note_id: str) -> dict[str, Any]:
        """Delete note for patient by nurse."""
        with self.db.get_session() as session:
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
