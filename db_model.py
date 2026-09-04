from sqlalchemy import Column,INTEGER,String,Float,ForeignKey,DateTime,TEXT,JSON,DATE,func
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base=declarative_base()

        

class Nurse(Base):
    __tablename__='nurses'
    # create nurse id with uuid but with follow a pattern
    nurse_id=Column(String(36),primary_key=True)
    nurse_name=Column(String(120),nullable=True)
    nurse_password_hash=Column(String(255),nullable=False)
    nurse_email=Column(String(255),nullable=False,unique=True,index=True)
    # this when nurse registers 
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
    assigned_nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=False,index=True)
    patient_created_at=Column(DateTime,server_default=func.current_timestamp())
    
class DosageCalculation(Base):
    __tablename__ = "dosage_calculations"

    dose_calc_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36),ForeignKey("patients.patient_id"),nullable=False,index=True)
    nurse_id = Column(String(36),ForeignKey("nurses.nurse_id"),nullable=False,index=True)
    patient_weight = Column(Float, nullable=False)
    medication = Column(String(200), nullable=False)
    dose_per_kg = Column(Float, nullable=False)
    dose_unit = Column(String(20), nullable=False)
    concentration_value = Column(Float, nullable=False)
    concentration_unit = Column(String(20), nullable=False)

    dosage_created_at = Column(
        DateTime,
        server_default=func.current_timestamp()
    )


class NursingNote(Base):
    __tablename__ = "nursing_notes"

    note_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey("patients.patient_id"), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey("nurses.nurse_id"), nullable=False, index=True)
    patient_condition = Column(TEXT)
    conscious_level = Column(String(36))
    glasgow_coma_score = Column(INTEGER)
    pain_scale = Column(INTEGER)
    soap_history = Column(JSON, default=list)
    notes_created_at = Column(DateTime,server_default=func.current_timestamp())


class IVDripCalculation(Base):
    __tablename__ = 'iv_drip_calculations'

    drip_calc_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id'), nullable=False, index=True)
    total_volume_ml = Column(Float, nullable=False)
    time_duration_min = Column(Float, nullable=False)
    drop_factor = Column(Float)
    drop_per_min = Column(INTEGER)
    created_at = Column(DateTime, server_default=func.current_timestamp())


class SBAR(Base):
    __tablename__ = 'sbar'
    sbar_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id'), nullable=False, index=True)
    situation = Column(TEXT)
    background = Column(TEXT)
    assessment = Column(TEXT)
    recommendation = Column(TEXT)
    current_iv_medications = Column(JSON, default=dict)
    nursing_interventions = Column(JSON, default=dict)
    soap_notes = Column(JSON, default=dict)
    sbar_created_at = Column(DateTime, server_default=func.current_timestamp())


class Vitals(Base):
    __tablename__ = 'vitals'

    vital_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id'), nullable=False, index=True)
    nurse_id = Column(String(36), ForeignKey('nurses.nurse_id'), nullable=False, index=True)
    source = Column(String(30), nullable=False)
    vitals_data = Column(JSON, default=dict)
    recorded_at = Column(DateTime, server_default=func.current_timestamp())
    
    
class CurrentMedication(Base):
    __tablename__ = 'current_medications'
    
    med_id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey('patients.patient_id'), nullable=False, index=True)
    med_name = Column(String(255), nullable=False)
    dose = Column(Float)
    dose_unit = Column(String(20))
    frequency = Column(String(50))
    med_start_date = Column(DateTime, server_default=func.current_timestamp())
    
    
    
