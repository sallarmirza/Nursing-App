import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
if not JWT_SECRET_KEY or JWT_SECRET_KEY == "dev-secret-change-me":
    raise RuntimeError(
        "JWT_SECRET_KEY env var is not set or is using the insecure default. "
        "Set a strong random secret in your .env file before starting the server."
    )
JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 30