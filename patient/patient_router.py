from fastapi import APIRouter,HTTPException,status
from patient.patient_service import PatientService
from storage import DBManager
from schema.patient_schema import PatientRegister,PatientResponse


router=APIRouter()

db=DBManager()
patient_service=PatientService(db)


@router.post('/create/{nurse_id}')
def create_patient_profile(nurse_id: str, data: PatientRegister):
    """creating patient profile"""
    try:
        return patient_service.create_patient_profile(nurse_id, data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get('/view/{nurse_id}/{patient_id}', response_model=PatientResponse)
def view_patient_information(nurse_id: str, patient_id: str) -> PatientResponse:
    """view patient's complete info"""
    try:
        return patient_service.view_patient(nurse_id, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{nurse_id}/all")
def show_all_patient(nurse_id: str):
    """List all patients under nurse."""
    try:
        return patient_service.all_patients(nurse_id)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete('/delete/{nurse_id}/{patient_id}')
def delete_patient_profile(
    nurse_id: str,
    patient_id: str
):
    """Delete patient profile."""
    try:
        return patient_service.delete_patient_acc(
            nurse_id,
            patient_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )