from storage import DBManager
import uuid
from datetime import datetime
from schema.register_schema import CurrentMedicationRegister
from sqlalchemy import text


class Medication:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_med_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:8].upper()

        return f"MED-{year}-{unique}"

    def add_medicine(self,nurse_id: str,patient_id: str,data: CurrentMedicationRegister) -> dict:
        """Add medication for a patient."""

        if not nurse_id or not patient_id:
            raise ValueError(
                "Nurse ID and Patient ID are required"
            )

        session = self.db.get_session()

        try:

            # Check that patient exists
            # and is assigned to this nurse
            check_patient = text("""
                SELECT patient_id
                FROM patients
                WHERE patient_id = :patient_id
                AND assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                check_patient,
                {
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if result is None:
                raise ValueError(
                    "Patient does not exist or "
                    "is not assigned to this nurse"
                )

            # Generate medication ID
            med_id = self.create_med_id()

            # Insert medication
            insert_medication = text("""
                INSERT INTO current_medications (
                    cm_id,
                    patient_id,
                    med_name,
                    dose,
                    dose_unit,
                    frequency,
                    med_start_date
                )
                VALUES (
                    :cm_id,
                    :patient_id,
                    :med_name,
                    :dose,
                    :dose_unit,
                    :frequency,
                    :med_start_date
                )
            """)

            session.execute(
                insert_medication,
                {
                    "cm_id": med_id,
                    "patient_id": patient_id,
                    "med_name": data.med_name,
                    "dose": data.dose,
                    "dose_unit": data.dose_unit,
                    "frequency": data.frequency,
                    "med_start_date": datetime.now()
                }
            )

            session.commit()

            return {
                "status": True,
                "message": "Medication added successfully",
                "cm_id": med_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "med_name": data.med_name,
                "dose": data.dose,
                "dose_unit": data.dose_unit,
                "frequency": data.frequency
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()
            
    def delete_medicine(self,nurse_id: str,patient_id: str,cm_id: str) -> dict:
        """Delete a medication for a patient."""
    
        if not nurse_id or not patient_id or not cm_id:
            raise ValueError(
                "Nurse ID, Patient ID and Medication ID are required"
            )

        session = self.db.get_session()

        try:

            # Check medication belongs to this patient
            # and patient belongs to this nurse
            check_medication = text("""
                SELECT cm.cm_id
                FROM current_medications AS cm
                JOIN patients AS p
                    ON cm.patient_id = p.patient_id
                WHERE cm.cm_id = :cm_id
                AND cm.patient_id = :patient_id
                AND p.assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                check_medication,
                {
                    "cm_id": cm_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if result is None:
                raise ValueError(
                    "Medication does not exist, does not belong "
                    "to this patient, or patient is not assigned "
                    "to this nurse"
                )

            # Delete medication
            delete_medication = text("""
                DELETE FROM current_medications
                WHERE cm_id = :cm_id
                AND patient_id = :patient_id
            """)

            session.execute(
                delete_medication,
                {
                    "cm_id": cm_id,
                    "patient_id": patient_id
                }
            )

            session.commit()

            return {
                "status": True,
                "message": "Medication deleted successfully",
                "cm_id": cm_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()
            
    def list_all_medication(self,nurse_id: str,patient_id: str) -> dict:
        """Display all medications for a patient."""

        session = self.db.get_session()

        try:

            show_meds_query = text("""
                SELECT
                    cm.cm_id,
                    cm.patient_id,
                    cm.med_name,
                    cm.dose,
                    cm.dose_unit,
                    cm.frequency,
                    cm.med_start_date
                FROM current_medications AS cm
                JOIN patients AS p
                    ON cm.patient_id = p.patient_id
                WHERE cm.patient_id = :patient_id
                AND p.assigned_nurse_id = :nurse_id
                ORDER BY cm.med_start_date DESC
            """)

            result = session.execute(
                show_meds_query,
                {
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )

            medications = result.mappings().all()

            if not medications:
                return {
                    "status": True,
                    "message": "No medications found",
                    "patient_id": patient_id,
                    "medications": []
                }

            return {
                "status": True,
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "medications": medications
            }

        except Exception as e:
            session.rollback()
            raise ValueError(
                f"Unable to retrieve medications: {str(e)}"
            )

        finally:
            session.close()
                
                