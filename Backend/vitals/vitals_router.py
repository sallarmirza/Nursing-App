from fastapi import APIRouter,HTTPException,status,Depends,Query
from vitals.vitals_service import Vitals
from .vitals_schema import VitalsRegister, VitalsCreateResponse, VitalsListResponse
from storage import db
from core.deps import get_current_nurse

vitals=Vitals(db)

router=APIRouter()

@router.post("/{nurse_id}/{patient_id}", response_model=VitalsCreateResponse, status_code=status.HTTP_201_CREATED)
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
        
@router.get("/{nurse_id}/{patient_id}", response_model=VitalsListResponse)
def show_vitals(
    nurse_id: str,
    patient_id: str,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return vitals.show_vitals(
            nurse_id=nurse_id,
            patient_id=patient_id,
            page=page,
            limit=limit,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))