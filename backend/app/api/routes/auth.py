from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.cruds import user_crud

router = APIRouter()

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    access_token = user_crud.login(db, email, password)
    if not access_token:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"access_token": access_token, "token_type": "bearer"}