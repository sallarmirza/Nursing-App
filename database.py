from sqlalchemy import Column,INTEGER,String,Float,Boolean,ForeignKey,DateTime,TEXT,JSON
from sqlalchemy.orm import declarative_base,relationship
from datetime import datetime

Base=declarative_base()

class Nurse(Base):
    __tablename__='nurses'
    # create nurse id with uuid but with follow a pattern
    nurse_id=Column(String(36),primary_key=True)
    nurse_name=Column(String(120),nullable=False)
    nurse_password_hash=Column(String(255),nullable=False)
    nurse_email=Column(String(255),nullable=False)
    # this when nurse registers 
    nurse_qualification=Column(String(255))
    nurse_designation=Column(String(255))
    nurse_hospital=Column(String(255))
    nurse_experience=Column(Float)
    nurse_created_at=Column(DateTime,default=lambda:datetime.now())


class Patient(Base):
    __tablename__='patients'
    patient_id=Column(String,primary_key=True)
    patient_name=Column(String(320),nullable=False)
    patient_weight=Column(Float,nullable=True)
    patient_height=Column(Float,nullable=True)
    patient_bloodgroup=Column(String,nullable=True)
    date_of_birth=Column(DateTime,nullable=True)
    ward=Column(String(100),nullable=True)
    addmission_diagonsis=Column(TEXT,nullable=True)
    assigned_nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=False)
    patient_created_at=Column(DateTime,default=lambda:datetime.now())
    

class DosageCalculation(Base):
    __tablename__='dosage_calculations'
    
    calc_id=Column(String(36),primary_key=True)
    patient_id=Column(String(36),ForeignKey('patients.patient_id'),nullable=True)
    nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=False)
    patient_weight=Column(Float,nullable=False)
    medication=Column(String,nullable=False)
    concentration_value=Column(Float,nullable=False)
    concentration_unit=Column(String,nullable=False)
    guideline=Column(String)
    dosage_created_at=Column(DateTime,default=lambda:datetime.now())
    

class NursingNote(Base):
    __tablename__='nursing_notes'

    note_id=Column(String(36),primary_key=True)
    patient_id=Column(String(36),ForeignKey('patients.patient_id'))
    nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'))
    patient_condition=Column(String(36))
    concious_level=Column(String(36))
    glasgow_comma_scale=Column()
    pain_scale=Column(INTEGER)
    notes_created_at=Column(DateTime,default=lambda:datetime.now())
    
class IVDripCalculation(Base):
    __tablename__='iv_drip_calculations'
    
    drip_calc_id=Column(String(36),primary_key=True)
    patient_id=Column(String(36),ForeignKey('patients.patient_id'),nullable=True)
    nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=True)
    total_volume_ml=Column(Float,nullable=False)
    time_duration_min=Column(Float,nullable=False)
    drop_factor=Column(TEXT)
    drop_per_min=Column(INTEGER)
    created_at=Column(DateTime,default=lambda:datetime.now())
    
class SBARHandover(Base):
    __tablename__='sbar_handovers'
    sbar_id=Column(String(36),primary_key=True)
    patient_id=Column(String(36),ForeignKey('patients.patient_id'),nullable=True)
    nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=True)
    situation=Column(TEXT)
    background=Column(TEXT)
    assessment=Column(TEXT)
    recommendation=Column(TEXT)
    current_medications=Column(JSON,default=dict)
    current_iv_medications=Column(JSON,default=dict)
    nursing_interventions=Column(JSON,default=dict)
    soap_notes=Column(JSON,default=dict)
    
    
class Vitals(Base):
    __tablename__='vitals'
    
    vital_id=Column(String(36),primary_key=True)
    patient_id=Column(String(36),ForeignKey('patients.patient_id'),nullable=False)
    nurse_id=Column(String(36),ForeignKey('nurses.nurse_id'),nullable=True)
    note_id=Column(String(36),ForeignKey('nursing_notes.note_id'),nullable=True)
    source=Column(String(20),nullable=False)
    vitals_data=Column(JSON,default=dict)
    
    
    
    
    