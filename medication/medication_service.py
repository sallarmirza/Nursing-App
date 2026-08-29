from storage import DBManager
import uuid
from datetime import datetime
from schema.register_schema import CurrentMedicationRegister

from db_model import CurrentMedication, Patient  # your SQLAlchemy models


class Medication:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_med_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:12].upper()

        return f"MED-{year}-{unique}"

    def add_medicine(self, nurse_id: str, patient_id: str, data: CurrentMedicationRegister) -> dict:
        """Add medication for a patient."""

        if not nurse_id or not patient_id:
            raise ValueError(
                "Nurse ID and Patient ID are required"
            )

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
                    "Patient does not exist or "
                    "is not assigned to this nurse"
                )

            med_id = self.create_med_id()

            medication = CurrentMedication(
                med_id=med_id,
                patient_id=patient_id,
                med_name=data.med_name,
                dose=data.dose,
                dose_unit=data.dose_unit,
                frequency=data.frequency,
            )

            session.add(medication)
            session.commit()  # was missing in the raw-SQL version

            return {
                "status": True,
                "message": "Medication added successfully",
                "med_id": med_id,
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

    def delete_medicine(self, nurse_id: str, patient_id: str, med_id: str) -> dict:
        """Delete a medication for a patient."""

        if not nurse_id or not patient_id or not med_id:
            raise ValueError(
                "Nurse ID, Patient ID and Medication ID are required"
            )

        session = self.db.get_session()

        try:
            medication = (
                session.query(CurrentMedication)
                .join(Patient, CurrentMedication.patient_id == Patient.patient_id)
                .filter(
                    CurrentMedication.med_id == med_id,
                    CurrentMedication.patient_id == patient_id,
                    Patient.assigned_nurse_id == nurse_id,
                )
                .first()
            )

            if medication is None:
                raise ValueError(
                    "Medication does not exist, does not belong "
                    "to this patient, or patient is not assigned "
                    "to this nurse"
                )

            session.delete(medication)
            session.commit()

            return {
                "status": True,
                "message": "Medication deleted successfully",
                "med_id": med_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def list_all_medication(self, nurse_id: str, patient_id: str) -> dict:
        """Display all medications for a patient."""

        session = self.db.get_session()

        try:
            rows = (
                session.query(CurrentMedication)
                .join(Patient, CurrentMedication.patient_id == Patient.patient_id)
                .filter(
                    CurrentMedication.patient_id == patient_id,
                    Patient.assigned_nurse_id == nurse_id,
                )
                .order_by(CurrentMedication.med_start_date.desc())
                .all()
            )

            if not rows:
                return {
                    "status": True,
                    "message": "No medications found",
                    "patient_id": patient_id,
                    "medications": []
                }

            medications = [
                {
                    "med_id": m.med_id,
                    "patient_id": m.patient_id,
                    "med_name": m.med_name,
                    "dose": m.dose,
                    "dose_unit": m.dose_unit,
                    "frequency": m.frequency,
                    "med_start_date": m.med_start_date,
                }
                for m in rows
            ]

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