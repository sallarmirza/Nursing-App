from fastapi import APIRouter, HTTPException, status

from schema.register_schema import DripCalculationRegister
from drip.drip_service import DripCalc
from storage import DBManager

db = DBManager()
drip_rate = DripCalc(db)

router = APIRouter()


@router.get('/{nurse_id}/{patient_id}')
def return_all_drip_for_patient(nurse_id:str,patient_id: str):
    try:
        return drip_rate.list_all_patient_drip_calculations(nurse_id,patient_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/calculate")
def calculate_drip_rate(data: DripCalculationRegister):
    """Calculate a simple drip rate (not saved)."""
    try:
        return drip_rate.calculate_simple_driprate(data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{nurse_id}/{patient_id}")
def calculate_patient_drip_rate(
    nurse_id: str,
    patient_id: str,
    data: DripCalculationRegister,
):
    """Calculate and save drip rate for a patient."""
    try:
        return drip_rate.calculate_driprate_with_patient(nurse_id, patient_id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{nurse_id}/{patient_id}/{drip_calc_id}")
def delete_drip_cal(nurse_id: str, patient_id: str, drip_calc_id: str):
    try:
        return drip_rate.delete_drip_calculation(nurse_id, patient_id, drip_calc_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))