from fastapi import APIRouter, HTTPException, status, Depends

from storage import DBManager
from medication.medication_service import Medication
from .medication_schema import CurrentMedicationRegister
from core.deps import get_current_nurse


router = APIRouter(prefix="/medications", tags=["Medications"])

db = DBManager()
medication_service = Medication(db)


@router.get("/{nurse_id}/{patient_id}")
def list_medications(
    nurse_id: str,
    patient_id: str,
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return medication_service.list_all_medication(
            nurse_id=nurse_id,
            patient_id=patient_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/{nurse_id}/{patient_id}")
def add_medication(
    nurse_id: str,
    patient_id: str,
    data: CurrentMedicationRegister,
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return medication_service.add_medicine(
            nurse_id=nurse_id,
            patient_id=patient_id,
            data=data
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{nurse_id}/{patient_id}/{med_id}")
def delete_medication(
    nurse_id: str,
    patient_id: str,
    med_id: str,
    current_nurse_id: str = Depends(get_current_nurse),
):
    try:
        return medication_service.delete_medicine(
            nurse_id=nurse_id,
            patient_id=patient_id,
            med_id=med_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )