import uuid
from datetime import datetime

from schema.register_schema import VitalsRegister
from storage import DBManager
from db_model import Vitals as VitalsModel, Patient 

class Vitals:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_vital_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:12].upper()
        return f"VITAL-{year}-{unique}"

    def create_vitals(self, nurse_id: str, patient_id: str, data: VitalsRegister):
        """Create and save patient vitals. Source is defined by frontend."""

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
                    "Patient does not exist or is not assigned to this nurse"
                )

            vital = VitalsModel(
                vital_id=self.create_vital_id(),
                patient_id=patient_id,
                nurse_id=nurse_id,
                source=data.source,
                vitals_data=data.vitals_data, 
            )

            session.add(vital)
            session.commit()
            session.refresh(vital)  

            return {
                "message": "Vitals created successfully",
                "vital_id": vital.vital_id,
                "patient_id": vital.patient_id,
                "nurse_id": vital.nurse_id,
                "source": vital.source,
                "vitals_data": vital.vitals_data,
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def show_vitals(self, nurse_id: str, patient_id: str):
        """List all vitals recorded for a patient by a given nurse."""

        session = self.db.get_session()

        try:
            rows = (
                session.query(VitalsModel)
                .filter(
                    VitalsModel.nurse_id == nurse_id,
                    VitalsModel.patient_id == patient_id,
                )
                .order_by(VitalsModel.recorded_at.desc())
                .all()
            )

            if not rows:
                return {
                    "message": "No vitals found",
                    "patient_id": patient_id,
                    "vitals": [],
                }

            vitals = [
                {
                    "vital_id": v.vital_id,
                    "patient_id": v.patient_id,
                    "nurse_id": v.nurse_id,
                    "source": v.source,
                    "vitals_data": v.vitals_data,  
                    "recorded_at": v.recorded_at,
                }
                for v in rows
            ]

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "vitals": vitals,
            }

        finally:
            session.close()