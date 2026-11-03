from sqlalchemy.exc import IntegrityError
from storage import DBManager
from nurse.nurse_schema import NurseSignUp, NurseRegister, NurseSignIn
from nurse.nurse_helper import hash_password, verify_password
from core.security import generate_refresh_token, hash_refresh_token
from core.config import REFRESH_TOKEN_EXPIRE_DAYS
import uuid
from datetime import datetime, timedelta

from db_model import Nurse, Patient, RefreshToken


class NurseService:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_nurse_id() -> str:
        year = datetime.now().year
        unique_part = uuid.uuid4().hex[:12].upper()
        return f"NUR-{year}-{unique_part}"

    def nurse_signup(self, data: NurseSignUp):
        with self.db.get_session() as session:
            existing_nurse = (
                session.query(Nurse)
                .filter(Nurse.nurse_email == data.nurse_email)
                .first()
            )

            if existing_nurse:
                raise ValueError("Nurse with this email already exists")

            nurse_id = self.create_nurse_id()
            hashed_password = hash_password(data.nurse_password)

            nurse = Nurse(
                nurse_id=nurse_id,
                nurse_email=data.nurse_email,
                nurse_password_hash=hashed_password,
            )

            try:
                session.add(nurse)
                session.commit()
            except IntegrityError:
                # Race condition: two signups with the same email both passed
                # the check above before either committed.
                raise ValueError("Nurse with this email already exists")

            return {
                "message": "Nurse registered successfully",
                "nurse_id": nurse_id
            }

    def nurse_account_setup(self, nurse_id: str, data: NurseRegister):
        """Additional info of nurse."""
        with self.db.get_session() as session:
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

    def list_all_nurses(self) -> dict:
        with self.db.get_session() as session:
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

    def delete_nurse(self, nurse_id: str) -> bool:
        """Delete nurse. Returns False if not found or on error."""
        try:
            with self.db.get_session() as session:
                nurse = session.query(Nurse).filter(Nurse.nurse_id == nurse_id).first()

                if nurse is None:
                    return False

                session.delete(nurse)
                session.commit()
                return True
        except Exception:
            return False

    def nurse_signIn(self, data: NurseSignIn):
        """Nurse login."""
        with self.db.get_session() as session:
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

    def get_nurse_profile(self, nurse_id: str):
        """Fetch one nurse's profile fields."""
        with self.db.get_session() as session:
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

    def nurse_patients(self, nurse_id: str):
        """Show all patients assigned to a nurse."""
        with self.db.get_session() as session:
            patients = (
                session.query(Patient)
                .filter(Patient.assigned_nurse_id == nurse_id)
                .all()
            )

            if not patients:
                return {"message": f"{nurse_id} has no patients"}

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

    def create_refresh_token(self, nurse_id: str) -> str:
        """Issues a new refresh token and stores its hash."""
        with self.db.get_session() as session:
            raw_token = generate_refresh_token()
            token_hash = hash_refresh_token(raw_token)
            expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

            refresh_token = RefreshToken(
                token_id=uuid.uuid4().hex[:12],
                nurse_id=nurse_id,
                token_hash=token_hash,
                expires_at=expires_at,
            )

            session.add(refresh_token)
            session.commit()

            return raw_token

    def verify_refresh_token(self, raw_token: str) -> str:
        """Returns the nurse_id if the refresh token is valid, raises otherwise."""
        with self.db.get_session() as session:
            token_hash = hash_refresh_token(raw_token)

            record = (
                session.query(RefreshToken)
                .filter(RefreshToken.token_hash == token_hash)
                .first()
            )

            if record is None or record.revoked:
                raise ValueError("Invalid refresh token")

            if record.expires_at < datetime.utcnow():
                raise ValueError("Refresh token expired")

            return record.nurse_id

    def revoke_refresh_token(self, raw_token: str) -> None:
        """Used on logout. Silently no-ops if the token doesn't exist."""
        with self.db.get_session() as session:
            token_hash = hash_refresh_token(raw_token)

            record = (
                session.query(RefreshToken)
                .filter(RefreshToken.token_hash == token_hash)
                .first()
            )

            if record:
                record.revoked = True
                session.commit()
