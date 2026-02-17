from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.cruds import user_crud
from app.schemas.user_schema import UserCreate, UserLogin

router = APIRouter()

@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    access_token = user_crud.login(db, payload.email, payload.password)
    if not access_token:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup")
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    user = user_crud.create(db, payload.email, payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    return {"message": "User created successfully"}