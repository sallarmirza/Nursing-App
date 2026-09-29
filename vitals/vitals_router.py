from fastapi import APIRouter,HTTPException,status,Depends
from vitals.vitals_service import Vitals
from .vitals_schema import VitalsRegister
from storage import DBManager
from core.deps import get_current_nurse

db=DBManager()
vitals=Vitals(db)

router=APIRouter()

@router.post("/{nurse_id}/{patient_id}")
def create_vitals(
    nurse_id: str,
    patient_id: str,
    data: VitalsRegister,
    current_nurse_id: str = Depends(get_current_nurse),
):
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
def show_vitals(
    nurse_id: str,
    patient_id: str,
    current_nurse_id: str = Depends(get_current_nurse),
):
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