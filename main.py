from contextlib import asynccontextmanager
from fastapi import FastAPI
from nurse.nurse_router import router as nursing_router
from storage import DBManager


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

app.include_router(nursing_router)

@app.get("/health")
def check_health():
    return {
        "status": "Live",
        "message": "Up and Running"
    }