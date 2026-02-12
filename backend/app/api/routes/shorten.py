from fastapi import APIRouter
from app.services.shortener import generate_short_code

router = APIRouter()

@router.post("/shorten")
def shorten_url(original_url: str):
    short_code = generate_short_code()
    return {"code": short_code, "original_url": original_url}