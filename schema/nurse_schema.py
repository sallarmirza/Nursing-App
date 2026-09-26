from pydantic import BaseModel,EmailStr,Field
from typing import Optional


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
    
    

class NurseProfile(BaseModel):
    nurse_id: str
    nurse_name: Optional[str] = None
    nurse_email: str
    nurse_qualification: Optional[str] = None
    nurse_designation: Optional[str] = None
    nurse_hospital: Optional[str] = None
    nurse_experience: Optional[float] = None