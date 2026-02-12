from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.schemas.url import URLCreate, URLResponse
from app.services.shortener import generate_code
from app.crud import url as crud_url
from app.db.session import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/shorten", response_model = URLResponse)
def shorten_url(payload: URLCreate, request: Request, db: Session = Depends(get_db)):
    code = generate_code()
    
    while crud_url.get_url_by_code(db, code):
        code = generate_code()

    db_url = crud_url.create(db, original_url=payload.original_url, code=code)

    base_url = str(request.base_url.rstrip("/"))
    short_url = f"{base_url}/r/{db_url.code}"

    return URLResponse(
        short_url=short_url,
        code=db_url.code,
        original_url=db_url.original_url
    )