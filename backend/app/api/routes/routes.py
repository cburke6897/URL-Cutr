from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from app.services.cache import redis_client
from sqlalchemy.orm import Session
from app.schemas.url_schema import URLCreate, URLResponse
from app.cruds import url_crud
from app.db.session import SessionLocal
from app.services.shortener import generate_code
from app.services.rate_limit import rate_limit
from app.core.tlds import is_valid_tld

router = APIRouter()

# Retrieves a database session for each request and ensures it is closed after the request is processed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint to create a shortened URL
@router.post("/shorten", response_model = URLResponse)
def shorten_url(payload: URLCreate, request: Request, db: Session = Depends(get_db)):
    # Validate that the provided original URL is in a valid format and uses the HTTP or HTTPS scheme
    if (not is_valid_tld(str(payload.original_url))):
        print("Invalid TLD")
        raise HTTPException(status_code=400, detail="Invalid URL format")

    # Implement rate limiting based on the client's IP address
    client_ip = request.client.host
    rate_limit(client_ip)

    if not payload.code:
        code = generate_code()
    else:
        code = payload.code
        # Validate that the provided custom code is unique and does not already exist in the database
        if url_crud.get_url_by_code(db, code):
            raise HTTPException(status_code=450, detail="Custom code already exists")

    
    # Ensure the generated code is unique by checking the database and regenerating if necessary
    while url_crud.get_url_by_code(db, code):
        code = generate_code()
    
    # Create a new URL entry in the database with the original URL and the generated code
    db_url = url_crud.create(db, original_url=str(payload.original_url), code=code, delete_after = None if payload.delete_after == 0 else payload.delete_after)

    # Construct the shortened URL using the base URL of the request and the generated code
    base_url = str(request.base_url).rstrip("/")
    short_url = f"{base_url}/r/{db_url.code}"

    # Return a response containing the original URL, the generated code, and the shortened URL
    return URLResponse(
        short_url=short_url,
        code=db_url.code,
        original_url=db_url.original_url,
        delete_at=str(db_url.delete_at)
    )

# Endpoint to redirect to the original URL based on the provided code
@router.get("/r/{code}")
def redirect(code: str, db: Session = Depends(get_db)):
    # Look up the original URL in the database using the provided code
    url = url_crud.get_url_by_code(db, code)
    if not url:
        return RedirectResponse("http://localhost:5173/?error=Invalid+URL", status_code=302)
    
    # Increment the click count for the URL and commit the change to the database
    url.clicks += 1
    db.commit()

    # Check if the original URL is cached in Redis using the code as the key
    cached_url = redis_client.get(f"url:{code}")
    if cached_url:
        return RedirectResponse(cached_url, status_code=302)
    
    # If the original URL is not cached, retrieve it from the database, cache it in Redis, and redirect to it
    original_url = url.original_url
    redis_client.set(f"url:{code}", original_url)
    return RedirectResponse(original_url, status_code=302)


# Endpoint to retrieve statistics for a shortened URL based on the provided code
@router.get("/stats/{code}")
def get_stats(code: str, db: Session = Depends(get_db)):
    # Look up the URL in the database using the provided code
    url = url_crud.get_url_by_code(db, code)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    
    return {
        "original_url": url.original_url,
        "clicks": url.clicks,
        "created_at": url.created_at
    }