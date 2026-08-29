from storage import DBManager
from datetime import datetime
import uuid
from schema.register_schema import PatientRegister

from db_model import Patient, Nurse  

class PatientService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_patient_id() -> str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()

        return f"PAT-{year}-{unique_part}"

    def create_patient_account(
        self,
        nurse_id: str,
        data: PatientRegister
    ) -> dict[str, str]:

        session = self.db.get_session()

        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if not nurse:
                raise ValueError("Nurse does not exist")

            patient_id = self.create_patient_id()

            patient = Patient(
                patient_id=patient_id,
                patient_name=data.patient_name,
                patient_gender=data.gender.value,
                date_of_birth=data.date_of_birth,
                patient_weight=data.patient_weight,
                patient_height=data.patient_height,
                patient_blood_group=(
                    data.patient_blood_group.value
                    if data.patient_blood_group
                    else None
                ),
                ward=data.patient_ward,
                assigned_nurse_id=nurse_id,
            )

            session.add(patient)
            session.commit()

            return {
                "patient_id": patient_id,
                "message": (
                    f"{data.patient_name} for "
                    f"{nurse_id} created successfully"
                )
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def all_patients(self, nurse_id: str):
        """List all patients assigned to a nurse."""
        session = self.db.get_session()

        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if not nurse:
                raise ValueError("Nurse not found")

            patients = (
                session.query(Patient)
                .filter(Patient.assigned_nurse_id == nurse_id)
                .all()
            )

            if not patients:
                return []

            return [
                {
                    "patient_id": p.patient_id,
                    "patient_name": p.patient_name,
                    "patient_gender": p.patient_gender,
                    "date_of_birth": p.date_of_birth,
                    "patient_weight": p.patient_weight,
                    "patient_height": p.patient_height,
                    "patient_blood_group": p.patient_blood_group,
                    "ward": p.ward,
                    "assigned_nurse_id": p.assigned_nurse_id,
                    "patient_created_at": p.patient_created_at,
                }
                for p in patients
            ]

        finally:
            session.close()

    def delete_patient_acc(self, nurse_id: str, patient_id: str) -> dict:
        """Delete a patient only if assigned to the requesting nurse."""
        session = self.db.get_session()

        try:
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
                    "Patient not found or you are not authorized to delete this patient"
                )

            session.delete(patient)
            session.commit()

            return {
                "patient_id": patient_id,
                "message": f"Patient {patient_id} deleted successfully"
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()