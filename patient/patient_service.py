from storage import DBManager
from datetime import datetime
import uuid
from schema.patient_schema import PatientRegister,PatientResponse
from typing import Any
from db_model import Patient, Nurse ,Vitals,NursingNote,CurrentMedication,DosageCalculation,SBAR,IVDripCalculation

class PatientService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_patient_id() -> str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()

        return f"PAT-{year}-{unique_part}"

    def create_patient_profile(self, nurse_id: str, data: PatientRegister) -> dict[str, str]:
        """create patient profile"""
        session = self.db.get_session()
        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()
            if not nurse:
                raise ValueError("Nurse does not exist")

            patient_id = self.create_patient_id()
            patient_name = f"{data.patient_first_name} {data.patient_last_name}".strip()

            patient = Patient(
                patient_id=patient_id,
                patient_name=patient_name,
                patient_gender=data.gender.value,
                date_of_birth=data.date_of_birth,
                patient_weight=data.patient_weight,
                patient_height=data.patient_height,
                patient_blood_group=(
                    data.patient_blood_group.value if data.patient_blood_group else None
                ),
                ward=data.patient_ward,
                assigned_nurse_id=nurse_id,
            )

            session.add(patient)
            session.commit()

            return {
                "patient_id": patient_id,
                "message": f"{patient_name} for {nurse_id} created successfully"
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
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if not nurse:
                raise ValueError("Nurse not found")

            patients = (
                session.query(Patient)
                .filter(Patient.assigned_nurse_id == nurse_id)
                .all()
            )

            if not patients:
                return []

            return [
                {
                    "patient_id": p.patient_id,
                    "patient_name": p.patient_name,
                    "patient_gender": p.patient_gender,
                    "date_of_birth": p.date_of_birth,
                    "patient_weight": p.patient_weight,
                    "patient_height": p.patient_height,
                    "patient_blood_group": p.patient_blood_group,
                    "ward": p.ward,
                    "assigned_nurse_id": p.assigned_nurse_id,
                    "patient_created_at": p.patient_created_at,
                }
                for p in patients
            ]

        finally:
            session.close()

    def delete_patient_acc(self, nurse_id: str, patient_id: str) -> dict:
        """Delete a patient only if assigned to the requesting nurse."""
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
                    "Patient not found or you are not authorized to delete this patient"
                )

            session.delete(patient)
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
                
                
    def view_patient(self, nurse_id: str, patient_id: str) -> dict[str, Any]:
        """view complete info of patient"""
        session = self.db.get_session()
        try:
            patient = (
                session.query(Patient)
                .filter(Patient.patient_id == patient_id, Patient.assigned_nurse_id == nurse_id)
                .first()
            )
            if patient is None:
                raise ValueError("Patient not found")

            vitals = (
                session.query(Vitals)
                .filter(Vitals.patient_id == patient_id)
                .order_by(Vitals.recorded_at.desc())
                .all()
            )

            nursing_notes = (
                session.query(NursingNote)
                .filter(NursingNote.patient_id == patient_id)
                .order_by(NursingNote.notes_created_at.desc())
                .all()
            )

            medications = (
                session.query(CurrentMedication)
                .filter(CurrentMedication.patient_id == patient_id)
                .order_by(CurrentMedication.med_start_date.desc())
                .all()
            )

            sbar_handovers = (
                session.query(SBAR)
                .filter(SBAR.patient_id == patient_id)
                .order_by(SBAR.sbar_created_at.desc())
                .all()
            )

            dosage_calculations = (
                session.query(DosageCalculation)
                .filter(DosageCalculation.patient_id == patient_id)
                .order_by(DosageCalculation.dosage_created_at.desc())
                .all()
            )

            drip_calculations = (
                session.query(IVDripCalculation)
                .filter(IVDripCalculation.patient_id == patient_id)
                .order_by(IVDripCalculation.created_at.desc())
                .all()
            )

            response = PatientResponse(
                patient_id=patient.patient_id,
                patient_name=patient.patient_name,
                patient_gender=patient.patient_gender,
                date_of_birth=patient.date_of_birth,
                patient_weight=patient.patient_weight,
                patient_height=patient.patient_height,
                patient_blood_group=patient.patient_blood_group,
                ward=patient.ward,
                assigned_nurse_id=patient.assigned_nurse_id,
                vitals=vitals,
                nursing_notes=nursing_notes,
                medications=medications,
                sbar_handovers=sbar_handovers,
                dosage_calculations=dosage_calculations,
                drip_calculations=drip_calculations,
            )

            return response.model_dump()

        except ValueError:
            raise
        finally:
            session.close()