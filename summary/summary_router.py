# summary/router.py
from fastapi import APIRouter, HTTPException, status

from storage import DBManager
from summary.summary_schema import DashboardResponse
from summary.summary_service import DashboardService

router = APIRouter()

db = DBManager()
dashboard_service = DashboardService(db)


@router.get("/{nurse_id}", response_model=DashboardResponse)
def get_dashboard(nurse_id: str):
    try:
        return dashboard_service.get_dashboard(nurse_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )