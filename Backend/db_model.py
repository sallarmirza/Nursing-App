# db_model.py
# All ForeignKey columns carry ondelete="CASCADE" so the DB enforces cleanup
# automatically when a parent row is deleted (nurse → patients → all clinical data).
# SQLite FK enforcement is enabled per-connection in storage.py.
from sqlalchemy import Column,INTEGER,String,Float,ForeignKey,DateTime,TEXT,JSON,DATE,func,Boolean,Index
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base=declarative_base()


class Nurse(Base):
    __tablename__='nurses'
    nurse_id=Column(String(36),primary_key=True)
    nurse_name=Column(String(120),nullable=True)
    nurse_password_hash=Column(String(255),nullable=False)
    nurse_email=Column(String(255),nullable=False,unique=True,index=True)
    nurse_qualification=Column(String(255))
    nurse_designation=Column(String(255))
    nurse_hospital=Column(String(255))
    nurse_experience=Column(Float)
    nurse_created_at=Column(DateTime,server_default=func.current_timestamp())


class Patient(Base):
    __tablename__='patients'
    patient_id=Column(String(36),primary_key=True)
    patient_name=Column(String(320),nullable=False,index=True)
    patient_gender=Column(String(20),nullable=True)
    patient_weight=Column(Float,nullable=True)
    patient_height=Column(Float,nullable=True)
    patient_blood_group=Column(String(10),nullable=True)
    date_of_birth=Column(DATE,nullable=True)
    ward=Column(String(255),nullable=True)
    assigned_nurse_id=Column(String(36),ForeignKey('nurses.nurse_id',ondelete='CASCADE'),nullable=False,index=True)
    patient_created_at=Column(DateTime,server_default=func.current_timestamp())


class DosageCalculation(Base):
    __tablename__ = "dosage_calculations"

    dose_calc_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey("patients.patient_id", ondelete="CASCADE"), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey("nurses.nurse_id", ondelete="CASCADE"), nullable=False, index=True)
    patient_weight = Column(Float, nullable=False)
    medication = Column(String(200), nullable=False)
    dose_per_kg = Column(Float, nullable=False)
    dose_unit = Column(String(20), nullable=False)
    concentration_value = Column(Float, nullable=False)
    concentration_unit = Column(String(20), nullable=False)
    dosage_created_at = Column(DateTime, server_default=func.current_timestamp())


class NursingNote(Base):
    __tablename__ = "nursing_notes"

    note_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey("patients.patient_id", ondelete="CASCADE"), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey("nurses.nurse_id", ondelete="CASCADE"), nullable=False, index=True)
    patient_condition = Column(TEXT)
    conscious_level = Column(String(36))
    glasgow_coma_score = Column(INTEGER)
    pain_scale = Column(INTEGER)
    nursing_interventions = Column(JSON, default=lambda: {})
    soap_history = Column(JSON, default=lambda: [])
    notes_created_at = Column(DateTime, server_default=func.current_timestamp())


class IVDripCalculation(Base):
    __tablename__ = 'iv_drip_calculations'

    drip_calc_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id', ondelete='CASCADE'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id', ondelete='CASCADE'), nullable=False, index=True)
    total_volume_ml = Column(Float, nullable=False)
    time_duration_min = Column(Float, nullable=False)
    drop_factor = Column(Float)
    drop_per_min = Column(INTEGER)
    created_at = Column(DateTime, server_default=func.current_timestamp())


class SBAR(Base):
    __tablename__ = 'sbar'

    sbar_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id', ondelete='CASCADE'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id', ondelete='CASCADE'), nullable=False, index=True)
    situation = Column(TEXT)
    background = Column(TEXT)
    assessment = Column(TEXT)
    recommendation = Column(TEXT)
    current_iv_medications = Column(JSON, default=lambda: {})
    nursing_interventions = Column(JSON, default=lambda: {})
    soap_notes = Column(JSON, default=lambda: {})
    sbar_created_at = Column(DateTime, server_default=func.current_timestamp())


class Vitals(Base):
    __tablename__ = 'vitals'

    vital_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id', ondelete='CASCADE'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id', ondelete='CASCADE'), nullable=False, index=True)
    source = Column(String(30), nullable=False)
    vitals_data = Column(JSON, default=lambda: {})
    recorded_at = Column(DateTime, server_default=func.current_timestamp())


class CurrentMedication(Base):
    __tablename__ = 'current_medications'

    med_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id', ondelete='CASCADE'), nullable=False, index=True)
    med_name = Column(String(255), nullable=False)
    dose = Column(Float)
    dose_unit = Column(String(20))
    frequency = Column(String(50))
    med_start_date = Column(DateTime, server_default=func.current_timestamp())


class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'

    token_id = Column(String(36), primary_key=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id', ondelete='CASCADE'), nullable=False, index=True)
    token_hash = Column(String(255), nullable=False, unique=True, index=True)
    revoked = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.current_timestamp())


# ---------------------------------------------------------------------------
# Composite indexes
# Every clinical query filters on (patient_id, nurse_id) together.
# Single-column indexes force the DB to pick one column and row-scan for the
# other. These indexes encode both columns so the DB reaches the target rows
# in one B-tree seek — no post-scan needed.
#
# CurrentMedication is excluded: it has no nurse_id column (access control
# there goes through a JOIN on the patients table instead).
#
# create_all() picks these up on a fresh DB. For an existing SQLite file,
# delete nursing.db and restart — data is dev-only. For PostgreSQL, Alembic
# will generate the CREATE INDEX statements in the migration.
# ---------------------------------------------------------------------------

Index('ix_vitals_patient_nurse',   Vitals.patient_id,              Vitals.nurse_id)
Index('ix_notes_patient_nurse',    NursingNote.patient_id,         NursingNote.nurse_id)
Index('ix_sbar_patient_nurse',     SBAR.patient_id,                SBAR.nurse_id)
Index('ix_drip_patient_nurse',     IVDripCalculation.patient_id,   IVDripCalculation.nurse_id)
Index('ix_dosage_patient_nurse',   DosageCalculation.patient_id,   DosageCalculation.nurse_id)
