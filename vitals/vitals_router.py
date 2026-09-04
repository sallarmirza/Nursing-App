from fastapi import APIRouter,HTTPException,status
from vitals.vitals_service import Vitals
from schema.register_schema import VitalsRegister
from storage import DBManager

db=DBManager()
vitals=Vitals(db)

router=APIRouter()

@router.post("/{nurse_id}/{patient_id}")
def create_vitals(nurse_id: str,patient_id: str,data: VitalsRegister):
    try:
        return vitals.create_vitals(
            nurse_id=nurse_id,
            patient_id=patient_id,
            data=data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
        
@router.get("/{nurse_id}/{patient_id}")
def show_vitals(nurse_id: str, patient_id: str):
    try:
        return vitals.show_vitals(
            nurse_id=nurse_id,
            patient_id=patient_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )