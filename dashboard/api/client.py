import requests 



BASE_URL='http://127.0.0.1:8000'


def get(endpoint:str):
    response=requests.get(
        f"{BASE_URL}{endpoint}"
    )
    
    return response


def post(endpoint:str,data:dict):
    response=requests.post(
        f"{BASE_URL}{endpoint}",
        json=data
    )
    return response

def delete(endpoint:str):
    response=requests.delete(
        f"{BASE_URL}{endpoint}"
    )
    return response