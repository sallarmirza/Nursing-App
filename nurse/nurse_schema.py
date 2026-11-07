from pydantic import BaseModel,EmailStr,Field
from typing import Optional


# --- Request bodies ---

class NurseSignUp(BaseModel):
    nurse_email:EmailStr
    nurse_password:str

class NurseSignIn(BaseModel):
    nurse_email:EmailStr
    nurse_password:str

class NurseRegister(BaseModel):
    nurse_name:str
    nurse_qualification: Optional[str] = None
    nurse_designation: Optional[str] = None
    nurse_hospital: Optional[str] = None
    nurse_experience: Optional[float] = Field(default=None, ge=0)

class TokenRefreshRequest(BaseModel):
    refresh_token:str


# --- Response models ---

class NurseProfile(BaseModel):
    nurse_id: str
    nurse_name: Optional[str] = None
    nurse_email: str
    nurse_qualification: Optional[str] = None
    nurse_designation: Optional[str] = None
    nurse_hospital: Optional[str] = None
    nurse_experience: Optional[float] = None

class NurseBasic(BaseModel):
    """Minimal nurse info embedded in the login response."""
    nurse_id: str
    nurse_name: Optional[str] = None
    nurse_email: str

class NurseActionResponse(BaseModel):
    """Returned by signup and profile-setup."""
    message: str
    nurse_id: str

class NurseLoginResponse(BaseModel):
    nurse: NurseBasic
    access_token: str
    refresh_token: str
    token_type: str

class TokenResponse(BaseModel):
    """Returned by /refresh."""
    access_token: str
    token_type: str

class MessageResponse(BaseModel):
    """Generic single-message response (logout, etc.)."""
    message: str

class NurseDeleteResponse(BaseModel):
    status: bool
    message: str