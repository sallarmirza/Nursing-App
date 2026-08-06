from fastapi import FastAPI
from db_model import get_db

app=FastAPI(title='Nursing-App')

@app.get('/health')
def check_health():
    return {"Status":"Live","Message":"Up n Running"}