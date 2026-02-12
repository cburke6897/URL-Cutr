from pydantic import BaseModel, HttpUrl

class URLCreate(BaseModel):
    original_url: HttpUrl

class URLResponse(BaseModel):
    code: str
    original_url: HttpUrl
    short_url: HttpUrl