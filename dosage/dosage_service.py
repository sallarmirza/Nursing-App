import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import text

from schema.register_schema import DosageCalculatorRegister
from storage import DBManager


class DosageCalc:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_dosage_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:8].upper()
        return f"DOSE-{year}-{unique}"

    def list_dosage_calculations(self, patient_id: str) -> dict:
        """List all dosage calculations for a patient."""
        session = self.db.get_session()
        try:
            query = text("""
                SELECT * FROM dosage_calculations
                WHERE patient_id = :patient_id
                ORDER BY dosage_created_at DESC
            """)
            result = session.execute(query, {"patient_id": patient_id})
            records = result.mappings().all()

            if not records:
                return {
                    "message": f"No dosage calculations for {patient_id}",
                    "patient_id": patient_id,
                    "dosages": []
                }

            return {
                "patient_id": patient_id,
                "dosages": records
            }
        except Exception:
            raise ValueError("Unable to retrieve dosage records")

    def calculate_simple_dosage(self,data:DosageCalculatorRegister):
        """calculate dosage without patient"""
        session=self.db.get_session()
        try:
            required_dose = data.patient_weight * data.dose_per_kg
            volume_to_administer = required_dose / data.concentration_value
            return {
                "medication": data.medication,
                "patient_weight_kg": data.patient_weight,
                "required_dose": required_dose,
                "dose_unit": data.dose_unit,
                "concentration": f"{data.concentration_value} {data.concentration_unit}",
                "volume_to_administer_ml": round(volume_to_administer, 2)
                }
        except Exception as e:
            raise ValueError(str(e))
        finally:
            session.close()
            
    def calculate_dosage_for_patient(self,nurse_id: str,patient_id: str,data: DosageCalculatorRegister)->dict[str,Any]:
        """Calculate and save medication dosage for a patient."""

        session = self.db.get_session()

        try:
            patient_check = text("""
                SELECT patient_id
                FROM patients
                WHERE patient_id = :patient_id
                AND assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                patient_check,
                {
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if result is None:
                raise ValueError(
                    "Patient does not exist or is not assigned to this nurse"
                )

            required_dose = data.patient_weight * data.dose_per_kg
            volume_to_administer = required_dose / data.concentration_value

            dose_calc_id = self.create_dosage_id()

            save_query = text("""
                INSERT INTO dosage_calculations (
                    dose_calc_id,
                    patient_id,
                    nurse_id,
                    patient_weight,
                    medication,
                    concentration_value,
                    concentration_unit,
                    dose_per_kg,
                    dose_unit
                )
                VALUES (
                    :dose_calc_id,
                    :patient_id,
                    :nurse_id,
                    :patient_weight,
                    :medication,
                    :concentration_value,
                    :concentration_unit,
                    :dose_per_kg,
                    :dose_unit
                )
            """)

            session.execute(
                save_query,
                {
                    "dose_calc_id": dose_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id,
                    "patient_weight": data.patient_weight,
                    "medication": data.medication,
                    "concentration_value": data.concentration_value,
                    "concentration_unit": data.concentration_unit,
                    "dose_per_kg": data.dose_per_kg,
                    "dose_unit": data.dose_unit
                }
            )

            session.commit()

            return {
                "dose_calc_id": dose_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "medication": data.medication,
                "patient_weight_kg": data.patient_weight,
                "required_dose": required_dose,
                "dose_unit": data.dose_unit,
                "concentration": f"{data.concentration_value} {data.concentration_unit}",
                "volume_to_administer_ml": round(volume_to_administer, 2)
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def delete_dosage_calculation(self,nurse_id: str,patient_id: str,dose_calc_id: str) -> dict[str, Any]:
        """Delete a specific dosage calculation."""

        if not nurse_id or not patient_id or not dose_calc_id:
            raise ValueError(
                "Nurse ID, patient ID and dosage calculation ID are required"
            )

        session = self.db.get_session()

        try:
            delete_query = text("""
                DELETE FROM dosage_calculations
                WHERE dose_calc_id = :dose_calc_id
                AND patient_id = :patient_id
                AND nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_query,
                {
                    "dose_calc_id": dose_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            if result.rowcount == 0:
                raise ValueError(
                    "Dosage calculation not found or does not belong "
                    "to this nurse/patient"
                )

            session.commit()

            return {
                "message": f"Dosage calculation {dose_calc_id} deleted successfully",
                "status": True,
                "dose_calc_id": dose_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()