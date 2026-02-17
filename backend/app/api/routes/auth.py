from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.cruds import user_crud

router = APIRouter()

# Retrieves a database session for each request and ensures it is closed after the request is processed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    access_token = user_crud.login(db, email, password)
    if not access_token:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"access_token": access_token, "token_type": "bearer"}