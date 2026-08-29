import uuid
from datetime import datetime
from typing import Any
from sqlalchemy import text
from schema.register_schema import DripCalculationRegister
from storage import DBManager


class DripCalc:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def drip_calc_id():
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:8].upper()
        return f"DRIP-{year}-{unique_part}"

    def list_all_patient_drip_calculations(self, nurse_id: str, patient_id: str) -> dict:
        """List all drip calculations for a patient, scoped to the requesting nurse."""
        session = self.db.get_session()
        try:
            query = text("""
                SELECT * FROM iv_drip_calculations
                WHERE patient_id = :patient_id
                AND nurse_id = :nurse_id
                ORDER BY created_at DESC
            """)
            result = session.execute(query, {"patient_id": patient_id, "nurse_id": nurse_id})
            patient_drips = result.mappings().all()

            if not patient_drips:
                return {
                    "message": f"No drip calculations for {patient_id}",
                    "patient_id": patient_id,
                    "drips": []
                }

            return {
                "patient_id": patient_id,
                "drips": patient_drips
            }
        except Exception as e:
            raise ValueError(f"Unable to retrieve drip records: {str(e)}")
        finally:
            session.close()

    def calculate_simple_driprate(self,data: DripCalculationRegister) -> dict[str, Any]:
        """Calculate IV drip rate without patient."""

        if data.time_duration_min <= 0:
            raise ValueError("Time duration must be greater than zero")

        drop_rate = (data.total_volume * data.drop_factor) / data.time_duration_min

        return {
            "total_volume_ml": data.total_volume,
            "time_duration_min": data.time_duration_min,
            "drop_factor": data.drop_factor,
            "drop_rate_gtt_min": round(drop_rate)
        }

    def calculate_driprate_with_patient(self,nurse_id: str,patient_id: str,data:DripCalculationRegister
    ) -> dict[str, Any]:
        """Calculate and save IV drip rate for a patient."""

        if not nurse_id or not patient_id:
            raise ValueError("Nurse ID and patient ID are required")

        if data.time_duration_min <= 0:
            raise ValueError("Time duration must be greater than zero")

        session = self.db.get_session()

        try:
            nurse_and_patient_check = text("""
                SELECT patient_id
                FROM patients
                WHERE patient_id = :patient_id
                  AND assigned_nurse_id = :assigned_nurse_id
            """)

            result = session.execute(
                nurse_and_patient_check,
                {
                    "patient_id": patient_id,
                    "assigned_nurse_id": nurse_id
                }
            ).fetchone()

            if result is None:
                raise ValueError(
                    "Patient does not exist or nurse is not assigned "
                    "to this patient"
                )

            drop_rate = round(
                (data.total_volume * data.drop_factor) / data.time_duration_min
            )

            drip_calc_id = self.drip_calc_id()

            insert_query = text("""
                INSERT INTO iv_drip_calculations (
                    drip_calc_id,
                    patient_id,
                    nurse_id,
                    total_volume_ml,
                    time_duration_min,
                    drop_factor,
                    drop_per_min
                )
                VALUES (
                    :drip_calc_id,
                    :patient_id,
                    :nurse_id,
                    :total_volume_ml,
                    :time_duration_min,
                    :drop_factor,
                    :drop_per_min
                )
            """)

            session.execute(
                insert_query,
                {
                    "drip_calc_id": drip_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id,
                    "total_volume_ml": data.total_volume,
                    "time_duration_min": data.time_duration_min,
                    "drop_factor": data.drop_factor,
                    "drop_per_min": drop_rate
                }
            )

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

    def delete_drip_calculation(self,nurse_id: str,patient_id: str,drip_calc_id: str) -> dict[str, Any]:
        """Delete a specific IV drip calculation."""
        if not nurse_id or not patient_id or not drip_calc_id:
            raise ValueError(
                "Nurse ID, patient ID and drip calculation ID are required"
            )

        session = self.db.get_session()

        try:
            delete_query = text("""
                DELETE FROM iv_drip_calculations
                WHERE drip_calc_id = :drip_calc_id
                AND patient_id = :patient_id
                AND nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_query,
                {
                    "drip_calc_id": drip_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            if result.rowcount == 0:
                raise ValueError(
                    "Drip calculation not found or does not belong "
                    "to this nurse/patient"
                )

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