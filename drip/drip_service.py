import uuid
from datetime import datetime
from typing import Any
from schema.register_schema import DripCalculationRegister
from storage import DBManager

from db_model import IVDripCalculation, Patient 

class DripCalc:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def drip_calc_id():
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()
        return f"DRIP-{year}-{unique_part}"

    def list_all_patient_drip_calculations(self, nurse_id: str, patient_id: str) -> dict:
        """List all drip calculations for a patient, scoped to the requesting nurse."""
        session = self.db.get_session()
        try:
            rows = (
                session.query(IVDripCalculation)
                .filter(
                    IVDripCalculation.patient_id == patient_id,
                    IVDripCalculation.nurse_id == nurse_id,
                )
                .order_by(IVDripCalculation.created_at.desc())
                .all()
            )

            if not rows:
                return {
                    "message": f"No drip calculations for {patient_id}",
                    "patient_id": patient_id,
                    "drips": []
                }

            drips = [
                {
                    "drip_calc_id": d.drip_calc_id,
                    "patient_id": d.patient_id,
                    "nurse_id": d.nurse_id,
                    "total_volume_ml": d.total_volume_ml,
                    "time_duration_min": d.time_duration_min,
                    "drop_factor": d.drop_factor,
                    "drop_per_min": d.drop_per_min,
                    "created_at": d.created_at,
                }
                for d in rows
            ]

            return {
                "patient_id": patient_id,
                "drips": drips
            }
        except Exception as e:
            raise ValueError(f"Unable to retrieve drip records: {str(e)}")
        finally:
            session.close()

    def calculate_simple_driprate(self, data: DripCalculationRegister) -> dict[str, Any]:
        """Calculate IV drip rate without patient. No DB access, unchanged."""

        if data.time_duration_min <= 0:
            raise ValueError("Time duration must be greater than zero")

        drop_rate = (data.total_volume * data.drop_factor) / data.time_duration_min

        return {
            "total_volume_ml": data.total_volume,
            "time_duration_min": data.time_duration_min,
            "drop_factor": data.drop_factor,
            "drop_rate_gtt_min": round(drop_rate)
        }

    def calculate_driprate_with_patient(
        self, nurse_id: str, patient_id: str, data: DripCalculationRegister
    ) -> dict[str, Any]:
        """Calculate and save IV drip rate for a patient."""

        if not nurse_id or not patient_id:
            raise ValueError("Nurse ID and patient ID are required")

        if data.time_duration_min <= 0:
            raise ValueError("Time duration must be greater than zero")

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
                    "Patient does not exist or nurse is not assigned "
                    "to this patient"
                )

            drop_rate = round(
                (data.total_volume * data.drop_factor) / data.time_duration_min
            )

            drip_calc_id = self.drip_calc_id()

            drip = IVDripCalculation(
                drip_calc_id=drip_calc_id,
                patient_id=patient_id,
                nurse_id=nurse_id,
                total_volume_ml=data.total_volume,
                time_duration_min=data.time_duration_min,
                drop_factor=data.drop_factor,
                drop_per_min=drop_rate,
            )

            session.add(drip)
            session.commit()

            return {
                "drip_calc_id": drip_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "total_volume_ml": data.total_volume,
                "time_duration_min": data.time_duration_min,
                "drop_factor": data.drop_factor,
                "drop_rate_gtt_min": drop_rate
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def delete_drip_calculation(
        self, nurse_id: str, patient_id: str, drip_calc_id: str
    ) -> dict[str, Any]:
        """Delete a specific IV drip calculation."""
        if not nurse_id or not patient_id or not drip_calc_id:
            raise ValueError(
                "Nurse ID, patient ID and drip calculation ID are required"
            )

        session = self.db.get_session()

        try:
            drip = (
                session.query(IVDripCalculation)
                .filter(
                    IVDripCalculation.drip_calc_id == drip_calc_id,
                    IVDripCalculation.patient_id == patient_id,
                    IVDripCalculation.nurse_id == nurse_id,
                )
                .first()
            )

            if drip is None:
                raise ValueError(
                    "Drip calculation not found or does not belong "
                    "to this nurse/patient"
                )

            session.delete(drip)
            session.commit()

            return {
                "message": f"Drip calculation {drip_calc_id} deleted successfully",
                "status": True,
                "drip_calc_id": drip_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()