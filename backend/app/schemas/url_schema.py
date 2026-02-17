from pydantic import BaseModel, HttpUrl

class URLCreate(BaseModel):
    original_url: HttpUrl
    delete_after: int | None = None
    code : str | None = None
    created_by: int | None = None

class URLResponse(BaseModel):
    code: str
    original_url: HttpUrl
    short_url: HttpUrl
    delete_at: str