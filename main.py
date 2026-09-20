from contextlib import asynccontextmanager
from fastapi import FastAPI
from nurse.nurse_router import router as nursing_router
from patient.patient_router import router as patient_router
from drip.drip_router import router as drip_router
from dosage.dosage_router import router as dosage_router
from nursing_notes.notes_router import router as notes_router
from sbar.sbar_router import router as sbar_router
from vitals.vitals_router import router as vitals_router
from medication.medication_router import router as med_router
from storage import DBManager
from fastapi.middleware.cors import CORSMiddleware
from summary.summary_router import router as dashboard_router

db = DBManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    db.initialize_db()
    print("Database initialized.")
    yield
    print("Closing database...")
    db.close()
    print("Database closed.")


app = FastAPI(
    title="Nursing-App",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8501",
        "http://127.0.0.1:8501",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(nursing_router,prefix="/nurse",tags=['Nurse'])
app.include_router(patient_router,prefix='/patient',tags=['Patient'])
app.include_router(drip_router,prefix="/calc/drip", tags=["Drip Calculations"])
app.include_router(dosage_router,prefix="/calc/dose", tags=["Dosage Calculations"])
app.include_router(notes_router,prefix="/notes",tags=["Notes"])
app.include_router(sbar_router,prefix="/sbar",tags=["Sbar"])
app.include_router(vitals_router,prefix='/vitals',tags=['Vitals'])
app.include_router(med_router)
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
@app.get("/health")
def check_health():
    return {
        "status": "Live",
        "message": "Up and Running"
    }