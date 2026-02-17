from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.security import SECRET_KEY, ALGORITHM
from app.db.session import get_db
from app.cruds.user_crud import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email=user_email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user