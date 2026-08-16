import uuid
from storage import DBManager
from sqlalchemy import text
from schema.register_schema import DripCalculationRegister
from datetime import date
from typing import Any

class DripRate:

    def __init__(self, db: DBManager):
        self.db = db
        
    @staticmethod
    def drip_calc_id():
        year=date.year()
        unique_part = uuid.uuid4().hex[:8].upper()
        return f"DRIP-{year}-{unique_part}"

    def cal_simple_driprate(
        self,
        data: DripCalculationRegister
    )->dict[str,str]:
        """Calculate IV drip rate without a patient."""

        if data.time_duration_min <= 0:
            raise ValueError("Time duration must be greater than zero")

        drop_rate = (
            data.total_volume * data.drop_factor
        ) / data.time_duration_min

        return {
            "total_volume_ml": data.total_volume,
            "time_duration_min": data.time_duration_min,
            "drop_factor": data.drop_factor,
            "drop_rate_gtt_min": round(drop_rate)
        }

    def cal_with_patient(
        self,
        nurse_id:str,
        patient_id:str,
        data: DripCalculationRegister
    )->dict[str,str]:
        """Calculate and save IV drip rate for a patient."""

        if not nurse_id or not patient_id:
            raise ValueError("Nurse ID and patient ID are required")

        if data.time_duration_min <= 0:
            raise ValueError(
                "Time duration must be greater than zero"
            )

        session = self.db.get_session()

        try:

            # Check patient and assigned nurse
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

            # Calculate drip rate
            drop_rate = (
                data.total_volume * data.drop_factor
            ) / data.time_duration_min

            drop_rate = round(drop_rate)

            # Generate ID
            drip_calc_id = str(uuid.uuid4())

            # Save calculation
            drip_data_for_save = text("""
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
                drip_data_for_save,
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
            
    def delete_calculation(self,nurse_id,patient_id)->dict[str,Any]:
        """delete calculation for drip"""
        session=self.db.get_session()
        try:
            delete_drip_cal=text("""delete from iv_drip_calculations where patient_id=:patient_id and nurse_id=:nurse_id """)
            
            session.execute(
                delete_drip_cal,
                {"nurse_id":nurse_id,
                 "patient_id":patient_id}
            )
            
            session.commit()
            return {
                "Message":f"Patient Record for {patient_id} Deleted Successfully by {nurse_id}",
                "Status":True,
            }
        except Exception as e:
            raise ValueError('Unable to delete')
        finally:
            session.close()