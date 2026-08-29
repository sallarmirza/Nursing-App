from fastapi import APIRouter, HTTPException, status
from sbar.sbar_service import Sbar
from storage import DBManager
from schema.register_schema import SBARHandoverRegister

db = DBManager()
sbar = Sbar(db)

router = APIRouter()

@router.post("/{nurse_id}/{patient_id}", status_code=status.HTTP_201_CREATED)
def create_sbar_handover(
    nurse_id: str,
    patient_id: str,
    data: SBARHandoverRegister
):
    try:
        return sbar.create_sbar(
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
def show_sbar_handovers(nurse_id: str, patient_id: str):
    try:
        return sbar.show_sbar(
            nurse_id=nurse_id,
            patient_id=patient_id
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    
@router.delete("/{nurse_id}/{patient_id}/{sbar_id}")
def remove_sbar_handover(nurse_id: str,patient_id: str,sbar_id: str):
    try:
        return sbar.delete_sbar_by_nurse(
            nurse_id=nurse_id,
            patient_id=patient_id,
            sbar_id=sbar_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )