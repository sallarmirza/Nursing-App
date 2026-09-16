from fastapi import APIRouter, HTTPException, status
from schema.calculation_schema import DosageCalculatorRegister
from dosage.dosage_service import DosageCalc
from storage import DBManager

db = DBManager()
dosage_cal = DosageCalc(db)

router = APIRouter()


@router.post("/calculate")
def calculate_dosage(data: DosageCalculatorRegister):
    """without adding patient"""
    try:
        return dosage_cal.calculate_simple_dosage(data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{nurse_id}/{patient_id}")
def calculate_medication_dosage_for_patient(
    nurse_id: str,
    patient_id: str,
    data: DosageCalculatorRegister,
):
    """dosage after selecting the patient"""
    try:
        return dosage_cal.calculate_dosage_for_patient(nurse_id, patient_id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{nurse_id}/{patient_id}")
def return_all_dosage_for_patient(nurse_id: str, patient_id: str):
    try:
        return dosage_cal.list_dosage_calculations(nurse_id, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{nurse_id}/{patient_id}/{dose_calc_id}")
def delete_dosage_cal(nurse_id: str, patient_id: str, dose_calc_id: str):
    try:
        return dosage_cal.delete_dosage_calculation(nurse_id, patient_id, dose_calc_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))