import uuid
from storage import DBManager
from sqlalchemy import text
from schema.register_schema import DripCalculationRegister,DosageCalculatorRegister
from datetime import datetime
from typing import Any

class DripCalc:

    def __init__(self, db: DBManager):
        self.db = db
        
    @staticmethod
    def drip_calc_id():
        year=datetime.now().year
        unique_part = uuid.uuid4().hex[:8].upper()
        return f"DRIP-{year}-{unique_part}"
    
    def list_drip_cal(self,patient_id:str)->dict:
        """list all drips cal for patient"""
        session=self.db.get_session()
        try:
            list_drips=text("""select * from iv_drip_calculations where patient_id=:patient_id""")
            result=session.execute(list_drips,
                                   {"patient_id":patient_id}).fetchall()
            
            if len(result)==0:
                return f"No drip calculations for {patient_id}"
            
            patient_drips=result.mappings.all()
            
            return patient_drips
        except :
            raise ValueError("Unable to retrive drips record") 
            

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


            drop_rate = (
                data.total_volume * data.drop_factor
            ) / data.time_duration_min

            drop_rate = round(drop_rate)

            
            drip_calc_id = self.drip_calc_id()

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
            
            
    def delete_drip_calculation(self,nurse_id: str,patient_id: str,drip_calc_id: str) -> dict[str, Any]:
        """Delete a specific IV drip calculation."""

        if not nurse_id or not patient_id or not drip_calc_id:
            raise ValueError(
                "Nurse ID, patient ID and drip calculation ID are required"
            )

        session = self.db.get_session()

        try:
            delete_drip_cal = text("""
                DELETE FROM iv_drip_calculations
                WHERE drip_calc_id = :drip_calc_id
                AND patient_id = :patient_id
                AND nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_drip_cal,
                {
                    "drip_calc_id": drip_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            # Nothing was deleted
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
                
class DosageCalc:
    def __init__(self,db:DBManager):
        self.db=db
    
    @staticmethod
    def create_dosage_id():
        year=datetime.now().year
        unique=uuid.uuid4().hex[:8].upper()
        return f"DOSE-{year}-{unique}"
    

    def calc_dosage(
        self,
        nurse_id: str,
        patient_id: str,
        data: DosageCalculatorRegister
    ):
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

            required_dose = (
                data.patient_weight * data.dose_per_kg
            )

            volume_to_administer = (
                required_dose / data.concentration_value
            )

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
                "concentration": (
                    f"{data.concentration_value} "
                    f"{data.concentration_unit}"
                ),
                "volume_to_administer_ml": round(
                    volume_to_administer,
                    2
                )
            }

        except Exception as e:
            session.rollback()
            raise

        finally:
            session.close()
            
         
    def delete_dosage_calculation(self,nurse_id: str,patient_id: str,dose_calc_id: str) -> dict[str, Any]:
        """Delete a specific IV drip calculation."""

        if not nurse_id or not patient_id or not dose_calc_id:
            raise ValueError(
                "Nurse ID, patient ID and drip calculation ID are required"
            )

        session = self.db.get_session()

        try:
            delete_drip_cal = text("""
                DELETE FROM dosage_calculations
                WHERE drip_dose_calc_id = :drip_dose_calc_id
                AND patient_id = :patient_id
                AND nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_drip_cal,
                {
                    "drip_dose_calc_id": dose_calc_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            )

            # Nothing was deleted
            if result.rowcount == 0:
                raise ValueError(
                    "Drip calculation not found or does not belong "
                    "to this nurse/patient"
                )

            session.commit()

            return {
                "message": f"Drip calculation {dose_calc_id} deleted successfully",
                "status": True,
                "drip_dose_calc_id": dose_calc_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()        
                
        