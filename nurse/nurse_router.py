from fastapi import APIRouter, HTTPException, status

from schema.nurse_schema import NurseRegister, NurseSignUp
from nurse.nurse_service import NurseService
from storage import DBManager


router = APIRouter()

db = DBManager()
nurse_service = NurseService(db)


@router.get("/all")
def show_all_nurses():
    """List all nurses."""

    try:
        return nurse_service.list_all_nurses()

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
        
        
@router.get('/{nurse_id}/patients')
def show_all_patients(nurse_id):
    """list all patients under nurse"""
    try:
        return nurse_service.nurse_patients(nurse_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail=str(e)
        )

@router.post("/signup")
def nurse_account_creation(data: NurseSignUp):
    try:
        return nurse_service.nurse_signup(data)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.post("/setup/{nurse_id}")
def nurse_data_setup(nurse_id: str,data: NurseRegister):
    try:
        return nurse_service.nurse_account_setup(
            nurse_id,
            data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete('/delete/{nurse_id}')
def delete_nurse_account(nurse_id):
    try:
        deleted=nurse_service.delete_nurse(nurse_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nurse not found"
            )
        
        return {
            "status":True,
            "Message":f"Nurse {nurse_id} deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,detail=str(e))