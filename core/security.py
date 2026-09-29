import hashlib
import secrets
from datetime import datetime, timedelta

import jwt

from core.config import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)


def create_access_token(nurse_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": nurse_id,
        "exp": expire,
        "type": "access",
    }

    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise ValueError("Access token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid access token")

    if payload.get("type") != "access":
        raise ValueError("Invalid token type")

    return payload


def generate_refresh_token() -> str:
    """Random opaque token given to the client. Not a JWT — just a secret."""
    return secrets.token_urlsafe(64)


def hash_refresh_token(raw_token: str) -> str:
    """Deterministic hash so we can look the token up by its hash in the DB.
    (Not pwdlib — that's salted/one-way-only-verify, no direct lookup.)"""
    return hashlib.sha256(raw_token.encode()).hexdigest()