from fastapi import APIRouter, HTTPException, status, Depends, Query

from .drip_schema import (
    DripCalculationRegister,
    DripSimpleResponse,
    DripPatientResponse,
    DripListResponse,
    DripDeleteResponse,
)
from drip.drip_service import DripCalc
from storage import db
from core.deps import get_current_nurse, get_current_nurse_id

drip_rate = DripCalc(db)

router = APIRouter()


@router.get('/{nurse_id}/{patient_id}', response_model=DripListResponse)
def return_all_drip_for_patient(
    nurse_id: str,
    patient_id: str,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return drip_rate.list_all_patient_drip_calculations(nurse_id, patient_id, page=page, limit=limit)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/calculate", response_model=DripSimpleResponse)
def calculate_drip_rate(
    data: DripCalculationRegister,
    current_nurse_id: str = Depends(get_current_nurse_id),
):
    """Calculate a simple drip rate (not saved)."""
    try:
        return drip_rate.calculate_simple_driprate(data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{nurse_id}/{patient_id}", response_model=DripPatientResponse, status_code=status.HTTP_201_CREATED)
def calculate_patient_drip_rate(
    nurse_id: str,
    patient_id: str,
    data: DripCalculationRegister,
    current_nurse_id: str = Depends(get_current_nurse),
):
    """Calculate and save drip rate for a patient."""
    try:
        return drip_rate.calculate_driprate_with_patient(nurse_id, patient_id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{nurse_id}/{patient_id}/{drip_calc_id}", response_model=DripDeleteResponse)
def delete_drip_cal(
    nurse_id: str,
    patient_id: str,
    drip_calc_id: str,
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return drip_rate.delete_drip_calculation(nurse_id, patient_id, drip_calc_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))