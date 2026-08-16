from sqlalchemy import text
from storage import DBManager
from schema.nurse_schema import NurseSignUp,NurseRegister
from nurse.nurse_helper import hash_password,verify_password
import uuid
from datetime import datetime


class NurseService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_nurse_id()->str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:8].upper()

        return f"NUR-{year}-{unique_part}"

    def nurse_signup(self, data: NurseSignUp):

        session = self.db.get_session()

        try:
            query = text("""
                SELECT nurse_email
                FROM nurses
                WHERE nurse_email = :email
            """)

            existing_nurse = session.execute(
                query,
                {"email": data.nurse_email}
            ).fetchone()

            if existing_nurse:
                raise ValueError(
                    "Nurse with this email already exists"
                )

            nurse_id = self.create_nurse_id()

            hashed_password = hash_password(
                data.nurse_password
            )

            nurse_register_query = text("""
                INSERT INTO nurses (
                    nurse_id,
                    nurse_email,
                    nurse_password_hash
                )
                VALUES (
                    :nurse_id,
                    :email,
                    :password_hash
                )
            """)

            session.execute(
                nurse_register_query,
                {
                    "nurse_id": nurse_id,
                    "email": data.nurse_email,
                    "password_hash": hashed_password
                }
            )

            session.commit()

            return {
                "message": "Nurse registered successfully",
                "nurse_id": nurse_id
            }

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()
                
    def nurse_account_setup(self, nurse_id: str, data: NurseRegister):

        session = self.db.get_session()

        try:

            update_query = text("""
                UPDATE nurses
                SET
                    nurse_name = :nurse_name,
                    nurse_qualification = :nurse_qualification,
                    nurse_designation = :nurse_designation,
                    nurse_hospital = :nurse_hospital,
                    nurse_experience = :nurse_experience
                WHERE nurse_id = :nurse_id
            """)

            result = session.execute(
                update_query,
                {
                    "nurse_id": nurse_id,
                    "nurse_name": data.nurse_name,
                    "nurse_qualification": data.nurse_qualification,
                    "nurse_designation": data.nurse_designation,
                    "nurse_hospital": data.nurse_hospital,
                    "nurse_experience": data.nurse_experience
                }
            )

            if result.rowcount == 0:
                raise ValueError("Nurse account not found")

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
            
    
    def list_all_nurses(self)->dict:
        session = self.db.get_session()

        try:
            list_nurse_query = text("""
                SELECT
                    nurse_id,
                    nurse_name,
                    nurse_email,
                    nurse_qualification,
                    nurse_designation,
                    nurse_hospital,
                    nurse_experience,
                    nurse_created_at
                FROM nurses
            """)

            result = session.execute(list_nurse_query)

            nurses = result.mappings().all()

            return nurses

        except Exception as e:
            raise ValueError("Failed to retrieve nurses")

        finally:
            session.close()
            
    def delete_nurse(self, nurse_id: str) -> bool:
        session = self.db.get_session()

        try:
            delete_nurse_query = text("""
                DELETE FROM nurses
                WHERE nurse_id = :nurse_id
            """)

            result = session.execute(
                delete_nurse_query,
                {"nurse_id": nurse_id}
            )

            if result.rowcount == 0:
                session.rollback()
                return False

            session.commit()
            return True

        except Exception:
            session.rollback()
            return False

        finally:
            session.close()
    
    
    def nurse_patients(self, nurse_id: str):
        """Show all patients assigned to a nurse."""

        session = self.db.get_session()

        try:
            show_patient_query = text("""
                SELECT *
                FROM patients
                WHERE assigned_nurse_id = :nurse_id
            """)

            result = session.execute(
                show_patient_query,
                {"nurse_id": nurse_id}
            )

            patients = result.mappings().all()

            if not patients:
                return {
                    "message": f"{nurse_id} has no patients"
                }

            return patients

        except Exception as e:
            raise ValueError("Failed to retrieve patients") from e

        finally:
            session.close()