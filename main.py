from fastapi import FastAPI

app=FastAPI(title='Nursing-App')

app.get('/health')
def check_health():
    return {"Status":"Live","Message":"Up n Running"}