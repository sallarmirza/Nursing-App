from contextlib import asynccontextmanager
from fastapi import FastAPI
from nurse.nurse_router import router as nursing_router
from patient.patient_router import router as patient_router
from calculations.calculations_router import router as cal_router
from notes.notes_router import router as notes_router
from sbar.sbar_router import router as sbar_router
from vitals.vitals_router import router as vitals_router
from medication.medication_router import router as med_router
from storage import DBManager
from fastapi.middleware.cors import CORSMiddleware

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
app.include_router(nursing_router)
app.include_router(patient_router)
app.include_router(cal_router)
app.include_router(notes_router)
app.include_router(sbar_router)
app.include_router(vitals_router)
app.include_router(med_router)

@app.get("/health")
def check_health():
    return {
        "status": "Live",
        "message": "Up and Running"
    }