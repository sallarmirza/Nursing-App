from fastapi import APIRouter, HTTPException, status, Depends

from nurse.nurse_schema import NurseRegister, NurseSignUp, NurseSignIn, TokenRefreshRequest
from nurse.nurse_service import NurseService
from storage import DBManager
from core.security import create_access_token
from core.deps import get_current_nurse, get_current_nurse_id


router = APIRouter()

db = DBManager()
nurse_service = NurseService(db)

# not to be used now , might come helpful later
@router.get("/all")
def show_all_nurses(current_nurse_id: str = Depends(get_current_nurse_id)):
    """List all nurses."""

    try:
        return nurse_service.list_all_nurses()

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
        
        
@router.get('/{nurse_id}/patients')
def show_all_patients(nurse_id: str, current_nurse_id: str = Depends(get_current_nurse)):
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
def nurse_profile_setup(nurse_id: str, data: NurseRegister, current_nurse_id: str = Depends(get_current_nurse)):
    """Complete a nurse's profile after signup."""
    try:
        return nurse_service.nurse_account_setup(nurse_id, data) 

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
 
@router.post("/login")
def nurse_login(data: NurseSignIn):
    try:
        nurse = nurse_service.nurse_signIn(data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    if nurse is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(nurse["nurse_id"])
    refresh_token = nurse_service.create_refresh_token(nurse["nurse_id"])

    return {
        "nurse": nurse,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
def refresh_access_token(data: TokenRefreshRequest):
    """Exchanges a valid refresh token for a new short-lived access token."""
    try:
        nurse_id = nurse_service.verify_refresh_token(data.refresh_token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

    access_token = create_access_token(nurse_id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(data: TokenRefreshRequest):
    """Revokes the refresh token so it can no longer be used."""
    nurse_service.revoke_refresh_token(data.refresh_token)
    return {"message": "Logged out successfully"}

 
@router.delete('/delete/{nurse_id}')
def delete_nurse_account(nurse_id: str, current_nurse_id: str = Depends(get_current_nurse)):
    try:
        deleted = nurse_service.delete_nurse(nurse_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nurse not found"
            )

        return {
            "status": True,
            "Message": f"Nurse {nurse_id} deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
# used to make profile presistant
@router.get("/{nurse_id}")
def get_nurse(nurse_id: str, current_nurse_id: str = Depends(get_current_nurse)):
    """Fetch a single nurse's profile."""
    try:
        return nurse_service.get_nurse_profile(nurse_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )