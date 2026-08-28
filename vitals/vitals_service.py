import uuid
import json
from datetime import datetime

from sqlalchemy import text

from schema.register_schema import VitalsRegister
from storage import DBManager


class Vitals:

    def __init__(self, db: DBManager):
        self.db = db

    @staticmethod
    def create_vital_id():
        year = datetime.now().year
        unique = uuid.uuid4().hex[:8].upper()

        return f"VITAL-{year}-{unique}"

    def create_vitals(
        self,
        nurse_id: str,
        patient_id: str,
        note_id: str,
        data: VitalsRegister
    ):
        """Create and save patient vitals."""

        session = self.db.get_session()

        try:

            patient_check = text("""
                SELECT patient_id
                FROM patients
                WHERE patient_id = :patient_id
                  AND assigned_nurse_id = :nurse_id
            """)

            patient_result = session.execute(
                patient_check,
                {
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if patient_result is None:
                raise ValueError(
                    "Patient does not exist or is not assigned "
                    "to this nurse"
                )

            note_check = text("""
                SELECT note_id
                FROM nursing_notes
                WHERE note_id = :note_id
                  AND patient_id = :patient_id
                  AND nurse_id = :nurse_id
            """)

            note_result = session.execute(
                note_check,
                {
                    "note_id": note_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id
                }
            ).fetchone()

            if note_result is None:
                raise ValueError(
                    "Nursing note does not exist or does not "
                    "belong to this patient/nurse"
                )

            vital_id = self.create_vital_id()

            insert_query = text("""
                INSERT INTO vitals (
                    vital_id,
                    patient_id,
                    nurse_id,
                    note_id,
                    source,
                    vitals_data
                )
                VALUES (
                    :vital_id,
                    :patient_id,
                    :nurse_id,
                    :note_id,
                    :source,
                    :vitals_data
                )
            """)

            session.execute(
                insert_query,
                {
                    "vital_id": vital_id,
                    "patient_id": patient_id,
                    "nurse_id": nurse_id,
                    "note_id": note_id,
                    "source": data.source,
                    "vitals_data": json.dumps(data.vitals_data)
                }
            )

            session.commit()

            return {
                "message": "Vitals created successfully",
                "vital_id": vital_id,
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "note_id": note_id,
                "source": data.source,
                "vitals_data": data.vitals_data
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
            query = text("""
                SELECT
                    vital_id,
                    patient_id,
                    nurse_id,
                    note_id,
                    source,
                    vitals_data,
                    recorded_at
                FROM vitals
                WHERE nurse_id = :nurse_id
                  AND patient_id = :patient_id
                ORDER BY recorded_at DESC
            """)

            result = session.execute(
                query,
                {
                    "nurse_id": nurse_id,
                    "patient_id": patient_id
                }
            )

            rows = result.mappings().all()

            if not rows:
                return {
                    "message": "No vitals found",
                    "patient_id": patient_id,
                    "vitals": []
                }

            vitals = []
            for row in rows:
                row_dict = dict(row)
                raw = row_dict.get("vitals_data")
                if isinstance(raw, str):
                    row_dict["vitals_data"] = json.loads(raw)
                vitals.append(row_dict)

            return {
                "patient_id": patient_id,
                "nurse_id": nurse_id,
                "vitals": vitals
            }

        except Exception:
            raise

        finally:
            session.close()