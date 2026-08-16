from storage import DBManager
from datetime import datetime
import uuid
from schema.register_schema import PatientRegister
from sqlalchemy import text


class PatientService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_patient_id() -> str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:8].upper()

        return f"PAT-{year}-{unique_part}"

    def create_patient(
        self,
        nurse_id: str,
        data: PatientRegister
    ) -> dict[str, str]:

        session = self.db.get_session()

        try:
            # Checking if nurse exists or not
            nurse_check = text("""
                SELECT nurse_id
                FROM nurses
                WHERE nurse_id = :nurse_id
            """)

            nurse = session.execute(
                nurse_check,
                {"nurse_id": nurse_id}
            ).fetchone()

            if not nurse:
                raise ValueError("Nurse does not exist")

         
            patient_id = self.create_patient_id()

         
            patient_creation_query = text("""
                INSERT INTO patients (
                    patient_id,
                    patient_name,
                    patient_gender,
                    date_of_birth,
                    patient_weight,
                    patient_height,
                    patient_blood_group,
                    ward,
                    assigned_nurse_id
                )
                VALUES (
                    :patient_id,
                    :patient_name,
                    :patient_gender,
                    :date_of_birth,
                    :patient_weight,
                    :patient_height,
                    :patient_blood_group,
                    :ward,
                    :nurse_id
                )
            """)

            session.execute(
            patient_creation_query,
            {
                "patient_id": patient_id,
                "patient_name": data.patient_name,
                "patient_gender": data.gender.value,
                "date_of_birth": data.date_of_birth,
                "patient_weight": data.patient_weight,
                "patient_height": data.patient_height,
                "patient_blood_group": (
                    data.patient_blood_group.value
                    if data.patient_blood_group
                    else None
                ),
                "ward": data.patient_ward,
                "nurse_id": nurse_id
            }
        )

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
            nurse_check_query = text("""
                SELECT nurse_id
                FROM nurses
                WHERE nurse_id = :nurse_id
            """)

            nurse = session.execute(
                nurse_check_query,
                {"nurse_id": nurse_id}
            ).fetchone()

            if not nurse:
                raise ValueError("Nurse not found")

            list_patient_query = text("""
                SELECT
                    patient_id,
                    patient_name,
                    patient_gender,
                    date_of_birth,
                    patient_weight,
                    patient_height,
                    patient_blood_group,
                    ward,
                    assigned_nurse_id,
                    patient_created_at
                FROM patients
                WHERE assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                list_patient_query,
                {"nurse_id": nurse_id}
            )

            patients = result.mappings().all()

            if not patients:
                return []

            return patients

        except Exception:
            raise

        finally:
            session.close()
                
    def delete_patient_acc(self, nurse_id: str, patient_id: str) -> dict:
        """Delete a patient only if assigned to the requesting nurse."""
        session = self.db.get_session()

        try:
            delete_patient_query = text("""
                DELETE FROM patients
                WHERE patient_id = :patient_id
                AND assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_patient_query,
                {
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            if result.rowcount == 0:
                session.rollback()
                raise ValueError(
                    "Patient not found or you are not authorized to delete this patient"
                )

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