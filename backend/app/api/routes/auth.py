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

@router.post("/signup")
def signup(email: str, username: str, password: str, db: Session = Depends(get_db)):
    user = user_crud.create(db, email, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    return {"message": "User created successfully"}