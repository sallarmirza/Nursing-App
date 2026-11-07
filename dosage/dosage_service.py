import uuid
from datetime import datetime
from typing import Any
from dosage.dosage_schema import DosageCalculatorRegister
from storage import DBManager
from db_model import DosageCalculation, Patient


class DosageCalc:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_dosage_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:8].upper()
        return f"DOSE-{year}-{unique}"

    def list_dosage_calculations(self, nurse_id: str, patient_id: str) -> dict:
        """List all dosage calculations for a patient, scoped by nurse."""
        with self.db.get_session() as session:
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

            rows = (
                session.query(DosageCalculation)
                .filter(DosageCalculation.patient_id == patient_id)
                .order_by(DosageCalculation.dosage_created_at.desc())
                .all()
            )

            if not rows:
                return {"patient_id": patient_id, "dosages": []}

            return {
                "patient_id": patient_id,
                "dosages": [
                    {
                        "dose_calc_id": d.dose_calc_id,
                        "patient_id": d.patient_id,
                        "nurse_id": d.nurse_id,
                        "patient_weight": d.patient_weight,
                        "medication": d.medication,
                        "dose_per_kg": d.dose_per_kg,
                        "dose_unit": d.dose_unit,
                        "concentration_value": d.concentration_value,
                        "concentration_unit": d.concentration_unit,
                        "dosage_created_at": d.dosage_created_at,
                    }
                    for d in rows
                ],
            }

    def calculate_simple_dosage(self, data: DosageCalculatorRegister):
        """Calculate dosage without patient. No DB access needed."""
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

    def calculate_dosage_for_patient(
        self, nurse_id: str, patient_id: str, data: DosageCalculatorRegister
    ) -> dict[str, Any]:
        """Calculate and save medication dosage for a patient."""
        with self.db.get_session() as session:
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

            required_dose = data.patient_weight * data.dose_per_kg
            volume_to_administer = required_dose / data.concentration_value
            dose_calc_id = self.create_dosage_id()

            dosage = DosageCalculation(
                dose_calc_id=dose_calc_id,
                patient_id=patient_id,
                nurse_id=nurse_id,
                patient_weight=data.patient_weight,
                medication=data.medication,
                concentration_value=data.concentration_value,
                concentration_unit=data.concentration_unit,
                dose_per_kg=data.dose_per_kg,
                dose_unit=data.dose_unit,
            )

            session.add(dosage)
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

    def delete_dosage_calculation(
        self, nurse_id: str, patient_id: str, dose_calc_id: str
    ) -> dict[str, Any]:
        """Delete a specific dosage calculation."""
        with self.db.get_session() as session:
            dosage = (
                session.query(DosageCalculation)
                .filter(
                    DosageCalculation.dose_calc_id == dose_calc_id,
                    DosageCalculation.patient_id == patient_id,
                    DosageCalculation.nurse_id == nurse_id,
                )
                .first()
            )

            if dosage is None:
                raise ValueError(
                    "Dosage calculation not found or does not belong "
                    "to this nurse/patient"
                )

            session.delete(dosage)
            session.commit()

            return {
                "message": f"Dosage calculation {dose_calc_id} deleted successfully",
                "status": True,
                "dose_calc_id": dose_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }
