from fastapi import APIRouter, HTTPException, status

from schema.register_schema import (
    DripCalculationRegister,
    DosageCalculatorRegister,
)
from calculations.calculations_service import DripCalc, DosageCalc
from storage import DBManager


router = APIRouter(
    prefix="/calc",
    tags=["Calculations"],
)

db = DBManager()

drip_rate = DripCalc(db)
dosage_cal = DosageCalc(db)

@router.get('/drip/{patient_id}')
def return_all_drip_for_patient(patient_id:str):
    try:
        return drip_rate.list_drip_cal(patient_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=str(e))

@router.post("/drip")
def calculate_drip_rate(data: DripCalculationRegister):
    """Calculate a simple drip rate."""
    return drip_rate.cal_simple_driprate(data)


@router.post("/drip/{nurse_id}/{patient_id}")
def calculate_patient_drip_rate(
    nurse_id: str,
    patient_id: str,
    data: DripCalculationRegister,
):
    """Calculate drip rate for a patient."""
    try:
        return drip_rate.cal_with_patient(
            nurse_id,
            patient_id,
            data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
        
        
@router.delete("/{nurse_id}/{patient_id}/{drip_calc_id}")
def delete_drip_cal(nurse_id,patient_id,drip_calc_id):
    try:
        return drip_rate.delete_drip_calculation(nurse_id,patient_id,drip_calc_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=str(e))


@router.post("/dose/{nurse_id}/{patient_id}")
def calculate_medication_dosage(
    nurse_id: str,
    patient_id: str,
    data: DosageCalculatorRegister,
):
    """Calculate medication dosage for a patient."""
    try:
        return dosage_cal.calc_dosage(
            nurse_id,
            patient_id,
            data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )