from fastapi import APIRouter,HTTPException,status
from schema.register_schema import DripCalculationRegister
from calculations.calculations_service import DripRate
from storage import DBManager

router=APIRouter(prefix='/calc',tags=['DripCalculations'])

db=DBManager()
drip_rate=DripRate(db)

@router.post('/drip')
def simple_cal(data:DripCalculationRegister):
    try:
        return drip_rate.cal_simple_driprate(data)
    except Exception as e:
         raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@router.post('/{nurse_id}/{patient_id}')
def cal_for_patient(nurse_id:str,patient_id:str,data:DripCalculationRegister):
    try:
        return drip_rate.cal_with_patient(nurse_id,patient_id,data)
    except Exception as e:
         raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
    
