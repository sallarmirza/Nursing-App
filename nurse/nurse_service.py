from sqlalchemy.exc import IntegrityError
from storage import DBManager
from schema.nurse_schema import NurseSignUp, NurseRegister,NurseSignIn
from nurse.nurse_helper import hash_password, verify_password
import uuid
from datetime import datetime

from db_model import Nurse, Patient  


class NurseService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_nurse_id() -> str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()

        return f"NUR-{year}-{unique_part}"

    def nurse_signup(self, data: NurseSignUp):

        session = self.db.get_session()

        try:
            existing_nurse = (
                session.query(Nurse)
                .filter(Nurse.nurse_email == data.nurse_email)
                .first()
            )

            if existing_nurse:
                raise ValueError(
                    "Nurse with this email already exists"
                )

            nurse_id = self.create_nurse_id()
            hashed_password = hash_password(data.nurse_password)

            nurse = Nurse(
                nurse_id=nurse_id,
                nurse_email=data.nurse_email,
                nurse_password_hash=hashed_password,
            )

            session.add(nurse)
            session.commit()

            return {
                "message": "Nurse registered successfully",
                "nurse_id": nurse_id
            }

        except IntegrityError:
            # Catches the race where two signups with the same email
            # both pass the check above before either commits
            session.rollback()
            raise ValueError("Nurse with this email already exists")

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def nurse_account_setup(self, nurse_id: str, data: NurseRegister):
        """additional info of nurse"""
        session = self.db.get_session()
        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if nurse is None:
                raise ValueError("Nurse account not found")

            nurse.nurse_name = data.nurse_name
            nurse.nurse_qualification = data.nurse_qualification
            nurse.nurse_designation = data.nurse_designation
            nurse.nurse_hospital = data.nurse_hospital
            nurse.nurse_experience = data.nurse_experience

            session.commit()

            return {
                "message": "Nurse account setup complete",
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

    def list_all_nurses(self) -> dict:
        session = self.db.get_session()

        try:
            rows = session.query(Nurse).all()

            return [
                {
                    "nurse_id": n.nurse_id,
                    "nurse_name": n.nurse_name,
                    "nurse_email": n.nurse_email,
                    "nurse_qualification": n.nurse_qualification,
                    "nurse_designation": n.nurse_designation,
                    "nurse_hospital": n.nurse_hospital,
                    "nurse_experience": n.nurse_experience,
                    "nurse_created_at": n.nurse_created_at,
                }
                for n in rows
            ]

        except Exception as e:
            raise ValueError("Failed to retrieve nurses") from e

        finally:
            session.close()

    def delete_nurse(self, nurse_id: str) -> bool:
        """delete nurse"""
        session = self.db.get_session()

        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if nurse is None:
                return False

            session.delete(nurse)
            session.commit()
            return True

        except Exception:
            # Note: this will also swallow the FK IntegrityError raised
            # when the nurse still has patients assigned to them on Postgres.
            # Consider raising distinct errors for "not found" vs
            # "can't delete, has dependent patients" instead of collapsing
            # both to False.
            session.rollback()
            return False

        finally:
            session.close()


    def nurse_signIn(self, data: NurseSignIn):
        """nurse login"""
        session = self.db.get_session()

        try:
            nurse = (
                session.query(Nurse)
                .filter(Nurse.nurse_email == data.nurse_email)
                .first()
            )

            if not nurse or not verify_password(data.nurse_password, nurse.nurse_password_hash):
                return None

            return {
                "nurse_id": nurse.nurse_id,
                "nurse_name": nurse.nurse_name,
                "nurse_email": nurse.nurse_email,
            }

        except Exception as e:
            raise ValueError("Login failed") from e

        finally:
            session.close()
            
    def get_nurse_profile(self, nurse_id: str):
        """Fetch one nurse's profile fields."""
        session = self.db.get_session()

        try:
            nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

            if nurse is None:
                raise ValueError("Nurse not found")

            return {
                "nurse_id": nurse.nurse_id,
                "nurse_name": nurse.nurse_name,
                "nurse_email": nurse.nurse_email,
                "nurse_qualification": nurse.nurse_qualification,
                "nurse_designation": nurse.nurse_designation,
                "nurse_hospital": nurse.nurse_hospital,
                "nurse_experience": nurse.nurse_experience,
            }

        except ValueError:
            raise

        except Exception as e:
            raise ValueError("Failed to retrieve nurse profile") from e

        finally:
            session.close()
            
    

    
    def nurse_patients(self, nurse_id: str):
        """Show all patients assigned to a nurse."""

        session = self.db.get_session()

        try:
            patients = (
                session.query(Patient)
                .filter(Patient.assigned_nurse_id == nurse_id)
                .all()
            )

            if not patients:
                return {
                    "message": f"{nurse_id} has no patients"
                }

            return [
                {
                    "patient_id": p.patient_id,
                    "patient_name": p.patient_name,
                    "patient_gender": p.patient_gender,
                    "patient_weight": p.patient_weight,
                    "patient_height": p.patient_height,
                    "patient_blood_group": p.patient_blood_group,
                    "date_of_birth": p.date_of_birth,
                    "ward": p.ward,
                    "assigned_nurse_id": p.assigned_nurse_id,
                    "patient_created_at": p.patient_created_at,
                }
                for p in patients
            ]

        except Exception as e:
            raise ValueError("Failed to retrieve patients") from e

        finally:
            session.close()