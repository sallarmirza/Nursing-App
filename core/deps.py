from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from core.security import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_nurse_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """Decodes the access token, returns the nurse_id inside it.
    Use this on endpoints that have no nurse_id path param (e.g. /nurse/all)."""

    try:
        payload = decode_access_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload["sub"]


def get_current_nurse(
    nurse_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """Use on endpoints that already take nurse_id as a path param.
    Verifies the token is valid AND belongs to that same nurse_id —
    this is your existing 'nurse_id scoping as access control' convention,
    just enforced against the token instead of trusting the path value."""

    token_nurse_id = get_current_nurse_id(credentials)

    if token_nurse_id != nurse_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this nurse's data",
        )

    return token_nurse_id