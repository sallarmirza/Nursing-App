from fastapi import APIRouter, HTTPException, status

from schema.nurse_schema import NurseRegister, NurseSignUp
from nurse.nurse_service import NurseService
from storage import DBManager


router = APIRouter(prefix="/nurse")

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
def nurse_data_setup(
    nurse_id: str,
    data: NurseRegister
):
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

@router.post('/delete/{nurse_id}')
def delete_nurse_account(nurse_id):
    try:
        return nurse_service.delete_nurse(nurse_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,detail=str(e))